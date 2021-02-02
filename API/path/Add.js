var mongoose = require('mongoose');

const UtilisateursSchema = require('./../models/Utilisateurs-model.js');
const ClientsSchema = require('./../models/Clients-model.js');
const ProjetsSchema = require('./../models/Projets-model.js');
const NotificationsSchema = require('./../models/Notifications-model.js');
const TachesSchema = require('./../models/Taches-model.js');

var TachesTools = require('./../tools/TachesTools.js');

module.exports = function(app){

  /** Ajout d'un Projet
   * requiert un champ :
   * @titre
   * @responsable
   * @description
   * @dateDebutInit
   * @dateFinInit
   * @_idMere
   * @collaborateur
   * !il faut que _idMere existe, sinon erreur
   * !il faut que le responsable existe dans Utilisateur et qu'il ne soit pas collaborateur, sinon erreur
<<<<<<< HEAD
   * !il faut que le responsable existe dans Utilisateur et qu'il ne soit pas collaborateur, sinon erreur
   * le champ listeSousTaches de la tache mere est update
=======
   !il faut que le responsable existe dans Utilisateur et qu'il ne soit pas collaborateur, sinon erreur
>>>>>>> 2dc518a6db8a35d5ab059fbd0179c0615a8cf44a
   * les champs listeTacheResponsable et listeTacheCollaborateur du responsable et du collaborateur sont automatiquement MAJ
   * renvoie un objet avec success a true si reussite, renvoie un objet avec success a false si echec
   */
  app.post('/Ajout/Tache', async (req,res) => {
    if (!req.body.titre || !req.body.responsable || !req.body.description || !req.body.dateDebutInit || !req.body.dateFinInit || !req.body._idMere || !req.body.collaborateur) {
      res.json({erreur: "Requete non valide. veuillez remplir les champs titre, responsable, mdp, description, dateDebutInit, dateFinInit, _idMere et collaborateur", success: false});
      return;
    }

    //On verifie que le client existe bien
    let DataMere;
    let Niveau;
    try {
      DataMere = await ProjetsSchema.findById(req.body._idMere);
      if (!DataMere) {
        DataMere = await TachesSchema.findById(req.body._idMere);
        if (!DataMere) {
          res.json({erreur: "Le projet/tache mere "+req.body._idMere+" n'existe pas dans la base de donnée. Veuillez rentrer un projet/tache mere existant", success: false});
          return;
        } else {
          Niveau = DataMere.niveau+1;
          if (Niveau>3) {
            res.json({erreur: "Impossible de creer une tache fille de niveau 4, le niveau d'imbriquation maximale étant 3", success: false});
            return;
          }
        }
      } else {
        Niveau = 1;
      }
    } catch (e) {
      console.error(e);
      res.json({erreur: "Une erreur est survenue lors de la recherche du projet/tache mere ", stack: e, success: false});
      return;
    }

    //On verifie que le responsable existe bien et bon role
    let DataResponsable;
    try {
      DataResponsable = await UtilisateursSchema.findOne({email: req.body.responsable});
      if (!DataResponsable) {
        res.json({erreur: "Le responsable "+req.body.responsable+" n'existe pas dans la base de donnée. Veuillez rentrer un responsable existant", success: false});
        return;
      }
      if (DataResponsable.role == "collaborateur") {
        res.json({erreur: "Le responsable "+req.body.responsable+" n'a pas le droit d'être responsable de projet", success: false});
        return;
      }
    } catch (e) {
      console.error(e);
      res.json({erreur: "Une erreur est survenue lors de la recherche du responsable", stack: e, success: false});
      return;
    }

    //On verifie que le collaborateur existe bien et bon role
    let DataCollaborateur;
    try {
      DataCollaborateur = await UtilisateursSchema.findOne({email: req.body.collaborateur});
      if (!DataCollaborateur) {
        res.json({erreur: "Le collaborateur "+req.body.collaborateur+" n'existe pas dans la base de donnée. Veuillez rentrer un collaborateur existant", success: false});
        return;
      }
    } catch (e) {
      console.error(e);
      res.json({erreur: "Une erreur est survenue lors de la recherche du collaborateur", stack: e, success: false});
      return;
    }

    //on convertit bien en Date
    try {
      req.body.dateDebutInit = new Date(req.body.dateDebutInit);
      req.body.dateFinInit = new Date(req.body.dateFinInit);
    } catch (e) {
      console.error(e);
      res.json({erreur: "Probleme lors du parsage des dates dateDebutInit et dateFinInit", stack: e, success: false});
      return;
    }

    try {
      let Chemin = await TachesTools.getChemin(DataMere._id);
      //on créé l'id manuellement pour le sauvegardé
      let ID = mongoose.Types.ObjectId();
      // On crée une instance du Model
      var NewTache = new TachesSchema({
        _id: ID,
        titre: req.body.titre,
        responsable: req.body.responsable,
        description: req.body.description,
        dateDebutInit: req.body.dateDebutInit,
        dateFinInit: req.body.dateFinInit,
        dateDebutEffect: req.body.dateDebutInit,
        dateFinEffect: req.body.dateFinInit,
        niveau: Niveau,
        chemin: Chemin,
        _idMere: DataMere._id,
        listeSousTaches: [],
        collaborateur: req.body.collaborateur,
        dataAvancement: {
          pourcent: 0, //entre 0 et 1
          chargeConsommé: 0, //Somme des soustaches
          chargeRestante: 0, //Somme des soustaches
          chargeInitiale: 0, //Somme des soustaches
          chargeEffective: 0, //Somme des soustaches
        },
        prédécesseurs: req.body.predecesseurs ? req.body.predecesseurs : [],
        sAlerte: true,
      });
      await NewTache.save();
      DataMere.listeSousTaches.push(ID);
      DataResponsable.listeTacheResponsable.push(ID);
      DataCollaborateur.listeTacheCollaborateur.push(ID);
      await DataResponsable.save();
      await DataCollaborateur.save();
      await DataMere.save();

      res.json({message: "La tache a bien été sauvegardé", success: true});
    } catch (e) {
      console.error(e);
      res.json({erreur: "Une erreur est survenue", stack: e, success: false});
    }
  })

  /** Ajout d'une Notification
   * requiert un champ :
   * @de //email
   * @pour //email
   * @contenu
   * renvoie un objet avec success a true si reussite, renvoie un objet avec success a false si echec
   */
  app.post('/Ajout/Notification', async (req,res) => {
    if (!req.body.de || !req.body.pour || !req.body.contenu) {
      res.json({erreur: "Requete non valide. veuillez remplir les champs de, pour et contenu", success: false});
      return;
    }

    let DataEnvoyeur;
    try {
      DataEnvoyeur = await UtilisateursSchema.findOne({email: req.body.de});
    /*  console.log("req.body.de", req.body.de);
      console.log("DataEnvoyeur", DataEnvoyeur);*/
      if (!DataEnvoyeur) {
        res.json({erreur: "L'envoyeur n'existe pas dans la base de donnée", success: false});
        return;
      }
    } catch (e) {
      res.json({erreur: "Un probleme est survenue lors de la recherche de l'envoyeur", success: false});
      return;
    }

    let DataDestinataire;
    try {
      DataDestinataire = await UtilisateursSchema.findOne({email: req.body.pour});
      if (!DataDestinataire) {
        res.json({erreur: "Le destinataire n'existe pas dans la base de donnée", success: false});
        return;
      }
    } catch (e) {
      res.json({erreur: "Un probleme est survenue lors de la recherche du destinataire", success: false});
      return;
    }



    try {
      let ID = mongoose.Types.ObjectId();
      // On crée une instance du Model
      var NewNotification = new NotificationsSchema({
        _id: ID,
        de: req.body.de,
        pour: req.body.pour,
        _idde: DataEnvoyeur._id,
        _idpour: DataDestinataire._id,
        contenu: req.body.contenu,
        date: new Date(),
      });
      DataDestinataire.listeNotifications.push(ID);
      await NewNotification.save();
      await DataDestinataire.save()
      res.json({message: "La notification a bien été envoyé a bien été sauvegardé", success: true})
    } catch (e) {
      res.json({erreur: "Une erreur est survenue", stack: e, success: false})
    }
  })


  /** Ajout d'un Projet
   * requiert un champ :
   * @titre
   * @responsable
   * @description
   * @dateDebutInit
   * @dateFinInit
   * @client
   * !il faut que le client existe, sinon erreur
   * !il faut que le responsable existe dans Utilisateur et qu'il ne soit pas collaborateur, sinon erreur
   * les champs listeProjets du client et du responsable sont automatiquement MAJ
   * renvoie un objet avec success a true si reussite, renvoie un objet avec success a false si echec
   */
  app.post('/Ajout/Projet', async (req,res) => {
    if (!req.body.titre || !req.body.responsable || !req.body.description || !req.body.dateDebutInit || !req.body.dateFinInit || !req.body.client) {
      res.json({erreur: "Requete non valide. veuillez remplir les champs titre, responsable, mdp, description, dateDebutInit, dateFinInit et client", success: false});
      return;
    }

    //On verifie que le client existe bien
    let DataClient;
    try {
      DataClient = await ClientsSchema.findOne({email: req.body.client});
      if (!DataClient) {
        res.json({erreur: "Le client "+req.body.client+" n'existe pas dans la base de donnée. Veuillez rentrer un client existant, ou creer un client avec ce mail", success: false});
        return;
      }
    } catch (e) {
      console.error(e);
      res.json({erreur: "Une erreur est survenue lors de la recherche du client", stack: e, success: false});
      return;
    }

    //On verifie que le responsable existe bien et bon role
    let DataResponsable;
    try {
      DataResponsable = await UtilisateursSchema.findOne({email: req.body.responsable});
      if (!DataResponsable) {
        res.json({erreur: "Le responsable "+req.body.responsable+" n'existe pas dans la base de donnée. Veuillez rentrer un client existant, ou creer un client avec ce mail", success: false});
        return;
      }
      if (DataResponsable.role == "collaborateur") {
        res.json({erreur: "Le responsable "+req.body.responsable+" n'a pas le droit d'être responsable de projet", success: false});
        return;
      }
    } catch (e) {
      console.error(e);
      res.json({erreur: "Une erreur est survenue lors de la recherche du responsable", stack: e, success: false});
      return;
    }

    //on convertit bien en Date
    try {
      req.body.dateDebutInit = new Date(req.body.dateDebutInit);
      req.body.dateFinInit = new Date(req.body.dateFinInit);
    } catch (e) {
      console.error(e);
      res.json({erreur: "Probleme lors du parsage des dates dateDebutInit et dateFinInit", stack: e, success: false});
      return;
    }

    try {
      //on créé l'id manuellement pour le sauvegardé
      let ID = mongoose.Types.ObjectId();
      // On crée une instance du Model
      var NewProjet = new ProjetsSchema({
        _id: ID,
        titre: req.body.titre,
        responsable: req.body.responsable,
        description: req.body.description,
        dateDebutInit: req.body.dateDebutInit,
        dateFinInit: req.body.dateFinInit,
        dateDebutEffect: req.body.dateDebutInit,
        dateFinEffect: req.body.dateFinInit,
        listeSousTaches: [],
        dataAvancement: {
          pourcent: 0, //entre 0 et 1
          chargeConsommé: 0, //Somme des soustaches
          chargeRestante: 0, //Somme des soustaches
          chargeInitiale: 0, //Somme des soustaches
          chargeEffective: 0, //Somme des soustaches
        },
        client: req.body.client,
      });
      await NewProjet.save();
      DataResponsable.listeProjets.push(ID);
      DataClient.listeProjets.push(ID);
      await DataResponsable.save()
      await DataClient.save()

      res.json({message: "Le projet a bien été sauvegardé", success: true});
    } catch (e) {
      console.error(e);
      res.json({erreur: "Une erreur est survenue", stack: e, success: false});
    }
  })


  /** Ajout d'un utilisateur
   * requiert un champ :
   * @nom
   * @prenom
   * @mdp
   * @email
   * @role
   * @mdp
   * @tel
   * renvoie un objet avec success a true si reussite, renvoie un objet avec success a false si echec
   */
  app.post('/Ajout/Utilisateur', async (req,res) => {
    if (!req.body.nom || !req.body.prenom || !req.body.mdp || !req.body.email || !req.body.role || !req.body.tel) {
      res.json({erreur: "Requete non valide. veuillez remplir les champs nom, prenom, mdp, email, role et tel", success: false});
      return;
    }
    if (req.body.role!="administrateur" && req.body.role!="responsable de projet" && req.body.role!="collaborateur") {
      res.json({erreur: "Champ role non valide. il ne peut prendre que les valeurs 'administrateur', 'responsable de projet' ou 'collaborateur' (tout en minuscule!)", success: false});
      return;
    }

    //On verifie que le mail n'existe pas deja
    try {
      let DataResponsable = await UtilisateursSchema.findOne({email: req.body.email});
      if (DataResponsable) {
        res.json({erreur: "L'utilisateur avec le mail "+req.body.email+" existe deja dans la base de donnée", success: false});
        return;
      }
    } catch (e) {
      console.error(e);
      res.json({erreur: "Une erreur est survenue lors de la recherche d'utilisateur unique", stack: e, success: false});
      return;
    }


    try {
      // On crée une instance du Model
      var NewUtilisateur = new UtilisateursSchema({
        nom: req.body.nom,
        prenom: req.body.prenom,
        mdp: req.body.mdp,
        email: req.body.email,
        role: req.body.role,
        tel: req.body.tel,
        listeProjets: [],
        listeNotifications: [],
        listeTacheCommencés: []
      });

      await NewUtilisateur.save();
      res.json({message: "L'utilisateur a bien été sauvegardé", success: true})

    } catch (e) {
      res.json({erreur: "Une erreur est survenue", stack: e, success: false})
    }
  })

  /** Ajout d'un client
   * requiert un champ :
   * @nomEntreprise
   * @tel
   * @email
   * @contactsAssocies
   * renvoie un objet avec success a true si reussite, renvoie un objet avec success a false si echec
   */
  app.post('/Ajout/Client', async (req,res) => {
    if (!req.body.nomEntreprise || !req.body.tel || !req.body.email) {
      res.json({erreur: "Requete non valide. veuillez remplir les champs nomEntreprise, email et tel", success: false});
      return;
    }

    try {
      // On crée une instance du Model
      var NewClient = new ClientsSchema({
        nomEntreprise: req.body.nomEntreprise,
        email: req.body.email,
        tel: req.body.tel,
        contactsAssocies: req.body.contactsAssocies ? req.body.contactsAssocies : [],
      });

      await NewClient.save();
      res.json({message: "Le client a bien été sauvegardé", success: true})

    } catch (e) {
      res.json({erreur: "Une erreur est survenue", stack: e, success: false})
    }
  })




}
