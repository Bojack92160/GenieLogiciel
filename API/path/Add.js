var mongoose = require("mongoose");

const UtilisateursSchema = require("./../models/Utilisateurs-model.js");
const ClientsSchema = require("./../models/Clients-model.js");
const ProjetsSchema = require("./../models/Projets-model.js");
const NotificationsSchema = require("./../models/Notifications-model.js");
const TachesSchema = require("./../models/Taches-model.js");
const Rapports_Activites = require("./../models/Rapports_Activites-model.js");

var TachesTools = require("./../tools/TachesTools.js");
var NotificationTools = require("./../tools/NotificationTools.js");
require("./../tools/DatePrototypes.js");

module.exports = function (app) {
  /** Ajout d'un Rapport_Activite
   * requiert un champ :
   * @_idTache
   * @_idUtilisateur
   * @periodeDebut
   * @periodeFin
   * @chargeEffectue
   * @chargeRestante
   * @avancementFinal //entre 0 et 1 (pourcentage)
   * !il faut que _idTache, _idUtilisateur existe, sinon erreur
   * !il faut que le responsable existe dans Utilisateur et qu'il ne soit pas collaborateur, sinon erreur
   * !il faut que le responsable existe dans Utilisateur et qu'il ne soit pas collaborateur, sinon erreur
   * le champ listeSousTaches de la tache mere est update
   * les champs listeTacheResponsable et listeTacheCollaborateur du responsable et du collaborateur sont automatiquement MAJ
   * renvoie un objet avec success a true si reussite, renvoie un objet avec success a false si echec
   */
  app.post("/Ajout/Rapport_Activite", async (req, res) => {
    if (
      !req.body._idTache ||
      !req.body._idUtilisateur ||
      !req.body.periodeDebut ||
      !req.body.periodeFin ||
      isNaN(req.body.chargeEffectue) ||
      isNaN(req.body.chargeRestante) ||
      isNaN(req.body.avancementFinal)
    ) {
      res.json({
        erreur:
          "Requete non valide. veuillez remplir les champs _idTache, _idUtilisateur, periodeDebut, periodeFin, chargeEffectue, chargeRestante et avancementFinal",
        success: false,
      });
      return;
    }

    let DataTache;
    let DataUtilisateur;
    try {
      DataTache = await TachesSchema.findById(req.body._idTache);
      DataUtilisateur = await UtilisateursSchema.findById(req.body._idUtilisateur);
      if (!DataTache) {
        res.json({
          erreur:
            "La tache  " +
            req.body._idTache +
            " n'existe pas dans la base de donnée. Veuillez rentrer une id de tache existante",
          success: false,
        });
        return;
      } else if (!DataUtilisateur) {
        res.json({
          erreur:
            "L'utilisateur  " +
            req.body._idUtilisateur +
            " n'existe pas dans la base de donnée. Veuillez rentrer un utilisateur existant",
          success: false,
        });
        return;
      } else {
        if (DataTache.listeSousTaches.length > 0) {
          res.json({
            erreur:
              "Impossible de remplir un rapport sur cette tache, elle possède au moin une sous tache (une tache doit etre du plus bas niveau pour pouvoir saisir des rapports)",
            success: false,
          });
          return;
        }
        if (DataTache.prédécesseurs.length) {
          for (var i = 0; i < DataTache.prédécesseurs.length; i++) {
            let DataTachePredec = await TachesSchema.findById(
              DataTache.prédécesseurs[i]
            );
            if (
              DataTachePredec &&
              DataTachePredec.dataAvancement.pourcent < 1
            ) {
              res.json({
                erreur:
                  "Impossible de remplir un rapport sur cette tache, elle possède au moin un prédécesseur qui n'est pas finit (" +
                  DataTachePredec.titre +
                  ")",
                success: false,
              });
              return;
            }
          }
        }
      }
      if (DataUtilisateur.email != DataTache.collaborateur) {
        res.json({
          erreur:
            "Action impossible! L'utilisateur qui souhaite remplir le rapport d'activité de cette tache n'est pas le collaborateur assigné à cette tache.",
          success: false,
        });
        return;
      }
    } catch (e) {
      console.error(e);
      res.json({
        erreur:
          "Une erreur est survenue lors de la recherche de la tache / utilisateur ",
        stack: e,
        success: false,
      });
      return;
    }

    try {
      req.body.periodeDebut = new Date(req.body.periodeDebut);
      req.body.periodeFin = new Date(req.body.periodeFin);
    } catch (e) {
      res.json({
        erreur:
          "Une erreur est survenue lors du parsage des dates. Il faut des objet Date()",
        stack: e,
        success: false,
      });
      return;
    }

    try {
      let DateDeSaisie = new Date();
      var NewRapport = new Rapports_Activites({
        _idUtilisateur: req.body._idUtilisateur,
        _idTache: req.body._idTache,
        emailUtilisateur: DataUtilisateur.email,
        dateDeSaisie: DateDeSaisie,
        periodeDebut: req.body.periodeDebut,
        periodeFin: req.body.periodeFin,
        chargeEffectue: req.body.chargeEffectue,
        chargeRestante: req.body.chargeRestante, //=chargeEffectue * (1-avancementFinal)/avancementEffectué)
        avancementInitial: DataTache.dataAvancement.pourcent, //entre 0 et 1 (pourcentage)
        avancementEffectue:
          req.body.avancementFinal - DataTache.dataAvancement.pourcent,
        avancementFinal: req.body.avancementFinal,
        commentaire: req.body.commentaire ? req.body.commentaire : "",
      });

      DataTache.dataAvancement.pourcent = req.body.avancementFinal;
      DataTache.dataAvancement.chargeConsomme += parseInt(req.body.chargeEffectue, 10);
      DataTache.dataAvancement.chargeRestante = parseInt(req.body.chargeRestante, 10);
      DataTache.dataAvancement.chargeEffective = parseInt(DataTache.dataAvancement.chargeConsomme, 10) + parseInt(req.body.chargeRestante, 10);
      DataTache.dateFinEffect.setDate(DateDeSaisie.getDate() + DataTache.dataAvancement.chargeRestante); //nouvelle date effective = date de saisie + chargeRestante
      if (DataTache.dateFinEffect > DataTache.dateFinInit) {
        await NotificationTools.sendSystemNotification(
          DataTache.responsable,
          "la tache " +
            DataTache.chemin +
            DataTache.titre +
            " a du retard. date de fin effective:" +
            DataTache.dateFinEffect.toLocaleDateString() +
            ", date de fin initiale:" +
            DataTache.dateFinInit.toLocaleDateString()
        );
      }
      //verification que tache terminée
      if (DataTache.dataAvancement.pourcent >= 1) {
        await TachesTools.closeTacheFinished(DataTache._id);
      }

      //clean des taches commencés
      console.log('DataUtilisateur', DataUtilisateur);
      for (var i = 0; i < DataUtilisateur.listeTacheCommences.length; i++) {
        if (DataUtilisateur.listeTacheCommences[i]._id == DataTache._id) {
          DataUtilisateur.listeTacheCommences[i] = {_id:"", dateDebut: new Date}; //je veux faire splice mais visiblement ca bug
          break;
        }
      }

      await DataUtilisateur.save();
      console.log('DataUtilisateur APRES', DataUtilisateur);
      await DataTache.save();
      await NewRapport.save();
      let result = await TachesTools.updateProjetFromTache(req.body._idTache);
      if (!result) {
        res.json({
          erreur: "Une erreur est survenue dans l update des taches mere!",
          success: true,
        });
      } else {
        res.json({
          message: "Rapport soumit et projet updater avec succes!!!",
          success: true,
        });
      }
    } catch (e) {
      console.error(e);
      res.json({ erreur: "Une erreur est survenue", stack: e, success: false });
      return;
    }
  });

  /** Ajout d'un Tache
   * requiert un champ :
   * @titre
   * @responsable
   * @description
   * @dateDebutInit
   * @dateFinInit
   * @_idMere
   * @collaborateur //si besoin! pas besoin si elle contiendra des sous taches plus tard
   * @chargeInitiale //si besoin! pas besoin si elle contiendra des sous taches plus tard (qui du coup fourniront les données)
   * @predecesseurs //si besoin, mais si fournit, doit etre un array d'id. exemple: ['14a6zd4165zefzefezf5615DS', 'azd1zadz615reg1yrtjn165']
   * !il faut que _idMere existe, sinon erreur
   * !il faut que le responsable existe dans Utilisateur et qu'il ne soit pas collaborateur, sinon erreur
   * !il faut que le collaborateur existe dans Utilisateur
   * le champ listeSousTaches de la tache mere est update
   * les champs listeTacheResponsable et listeTacheCollaborateur du responsable et du collaborateur sont automatiquement MAJ
   * renvoie un objet avec success a true si reussite, renvoie un objet avec success a false si echec
   */
  app.post("/Ajout/Tache", async (req, res) => {
    if (
      !req.body.titre ||
      !req.body.responsable ||
      !req.body.description ||
      !req.body.dateDebutInit ||
      !req.body.dateFinInit ||
      !req.body._idMere
    ) {
      res.json({
        erreur:
          "Requete non valide. veuillez remplir les champs titre, responsable, mdp, description, dateDebutInit, dateFinInit, _idMere",
        success: false,
      });
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
          res.json({
            erreur:
              "Le projet/tache mere " +
              req.body._idMere +
              " n'existe pas dans la base de donnée. Veuillez rentrer un projet/tache mere existant",
            success: false,
          });
          return;
        } else {
          if (DataMere.collaborateur != "") {
            res.json({
              erreur:
                "Impossible de creer une tache fille d'une tache contenant un collaborateur. Si la tache mere possède un collaborateur, cela suppose qu'elle est de niveau le plus bas possible, par conséquent, elle ne peut pas posséder de sous taches.",
              success: false,
            });
            return;
          }
          Niveau = DataMere.niveau + 1;
          if (Niveau > 3) {
            res.json({
              erreur:
                "Impossible de creer une tache fille de niveau 4, le niveau d'imbriquation maximale étant 3",
              success: false,
            });
            return;
          }
        }
      } else {
        Niveau = 1;
      }
    } catch (e) {
      console.error(e);
      res.json({
        erreur:
          "Une erreur est survenue lors de la recherche du projet/tache mere ",
        stack: e,
        success: false,
      });
      return;
    }

    //On verifie que le responsable existe bien et bon role

    let DataResponsable;
    try {
      DataResponsable = await UtilisateursSchema.findOne({
        email: req.body.responsable,
      });
      if (!DataResponsable) {
        res.json({
          erreur:
            "Le responsable " +
            req.body.responsable +
            " n'existe pas dans la base de donnée. Veuillez rentrer un responsable existant",
          success: false,
        });
        return;
      }
      if (DataResponsable.role == "collaborateur") {
        res.json({
          erreur:
            "Le responsable " +
            req.body.responsable +
            " n'a pas le droit d'être responsable de projet",
          success: false,
        });
        return;
      }
    } catch (e) {
      console.error(e);
      res.json({
        erreur: "Une erreur est survenue lors de la recherche du responsable",
        stack: e,
        success: false,
      });
      return;
    }

    //On verifie que le collaborateur existe bien et bon role
    let DataCollaborateur;
    if (req.body.collaborateur) {
      try {
        DataCollaborateur = await UtilisateursSchema.findOne({
          email: req.body.collaborateur,
        });
        if (!DataCollaborateur) {
          res.json({
            erreur:
              "Le collaborateur " +
              req.body.collaborateur +
              " n'existe pas dans la base de donnée. Veuillez rentrer un collaborateur existant",
            success: false,
          });
          return;
        }
      } catch (e) {
        console.error(e);
        res.json({
          erreur:
            "Une erreur est survenue lors de la recherche du collaborateur",
          stack: e,
          success: false,
        });
        return;
      }
    }

    //on convertit bien en Date
    try {
      req.body.dateDebutInit = new Date(req.body.dateDebutInit);
      req.body.dateFinInit = new Date(req.body.dateFinInit);
    } catch (e) {
      console.error(e);
      res.json({
        erreur:
          "Probleme lors du parsage des dates dateDebutInit et dateFinInit",
        stack: e,
        success: false,
      });
      return;
    }

    //on cheque les prédécesseurs
    if (req.body.predecesseurs) {
      try {
        for (var i = 0; i < req.body.predecesseurs.length; i++) {
          let DataPrede = await TachesSchema.findById(
            req.body.predecesseurs[i]
          );
          if (!DataPrede) {
            res.json({
              erreur:
                "la tache prédécesseuse " +
                req.body.predecesseurs[i] +
                " n existe pas",
              success: false,
            });
            return;
          } else if (
            DataPrede &&
            DataPrede.dateFinInit > req.body.dateDebutInit
          ) {
            res.json({
              erreur:
                "la tache prédécesseuse "+DataPrede.titre+" a une date de fin APRES la tache que vous voulez créer. C'est incohérent." ,
              success: false,
            });
            return;
          }
        }
      } catch (e) {
        console.error(e);
        res.json({
          erreur:
            "Une erreur est survenue lors de la recherche de prédécesseur",
          stack: e,
          success: false,
        });
        return;
      }
    }

    try {
      let Chemin = await TachesTools.getChemin(DataMere._id);
      const diffTime = Math.abs(req.body.dateDebutInit - req.body.dateFinInit);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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
        collaborateur: req.body.collaborateur ? req.body.collaborateur : "",
        dataAvancement: {
          pourcent: 0, //entre 0 et 1
          chargeConsomme: 0, //Somme des soustaches
          chargeRestante: req.body.chargeInitiale
            ? req.body.chargeInitiale
            : diffDays, //Somme des soustaches
          chargeInitiale: req.body.chargeInitiale
            ? req.body.chargeInitiale
            : diffDays, //Somme des soustaches
          chargeEffective: 0, //Somme des soustaches
        },
        prédécesseurs: req.body.predecesseurs ? req.body.predecesseurs : [],
        sAlerte: true,
      });
      await NewTache.save();
      DataMere.listeSousTaches.push(ID);
      DataResponsable.listeTacheResponsable.push(ID);

      if (req.body.collaborateur) {
        console.log("on save le collaborateur", DataCollaborateur);
        DataCollaborateur.listeTacheCollaborateur.push(ID);
        await DataCollaborateur.save();
      }

      await DataResponsable.save();
      await DataMere.save();
      await TachesTools.updateProjetFromTache(ID);
      await NotificationTools.sendSystemNotification(
        DataResponsable.email,
        "Une tache vient d'etre crééer et vous etes le responsable! (" +
          Chemin +
          req.body.titre +
          ")"
      );
      if (req.body.collaborateur) {
        await NotificationTools.sendSystemNotification(
          DataCollaborateur.email,
          "Une tache vient d'etre crééer et vous etes le collaborateur! (" +
            Chemin +
            req.body.titre +
            ")"
        );
      }
      res.json({ message: "La tache a bien été sauvegardé", success: true });
    } catch (e) {
      console.error(e);
      res.json({ erreur: "Une erreur est survenue", stack: e, success: false });
      return;
    }
  });

  /** Ajout d'une Notification
   * requiert un champ :
   * @de //email
   * @pour //email
   * @contenu
   * renvoie un objet avec success a true si reussite, renvoie un objet avec success a false si echec
   */
  app.post("/Ajout/Notification", async (req, res) => {
    if (!req.body.de || !req.body.pour || !req.body.contenu) {
      res.json({
        erreur:
          "Requete non valide. veuillez remplir les champs de, pour et contenu",
        success: false,
      });
      return;
    }

    let DataEnvoyeur;
    try {
      DataEnvoyeur = await UtilisateursSchema.findOne({ email: req.body.de });
      /*  console.log("req.body.de", req.body.de);
      console.log("DataEnvoyeur", DataEnvoyeur);*/
      if (!DataEnvoyeur) {
        res.json({
          erreur: "L'envoyeur n'existe pas dans la base de donnée",
          success: false,
        });
        return;
      }
    } catch (e) {
      res.json({
        erreur: "Un probleme est survenue lors de la recherche de l'envoyeur",
        success: false,
      });
      return;
    }

    let DataDestinataire;
    try {
      DataDestinataire = await UtilisateursSchema.findOne({
        email: req.body.pour,
      });
      if (!DataDestinataire) {
        res.json({
          erreur: "Le destinataire n'existe pas dans la base de donnée",
          success: false,
        });
        return;
      }
    } catch (e) {
      res.json({
        erreur: "Un probleme est survenue lors de la recherche du destinataire",
        success: false,
      });
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
      await DataDestinataire.save();
      res.json({
        message: "La notification a bien été envoyé a bien été sauvegardé",
        success: true,
      });
    } catch (e) {
      res.json({ erreur: "Une erreur est survenue", stack: e, success: false });
    }
  });

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
  app.post("/Ajout/Projet", async (req, res) => {
    if (
      !req.body.titre ||
      !req.body.responsable ||
      !req.body.description ||
      !req.body.dateDebutInit ||
      !req.body.dateFinInit ||
      !req.body.client
    ) {
      res.json({
        erreur:
          "Requete non valide. veuillez remplir les champs titre, responsable, description, date de début, date de fin et client",
        success: false,
      });
      return;
    }

    //On verifie que le client existe bien
    let DataClient;
    try {
      DataClient = await ClientsSchema.findOne({ email: req.body.client });
      if (!DataClient) {
        res.json({
          erreur:
            "Le client " +
            req.body.client +
            " n'existe pas dans la base de donnée. Veuillez rentrer un client existant, ou creer un client avec ce mail",
          success: false,
        });
        return;
      }
    } catch (e) {
      console.error(e);
      res.json({
        erreur: "Une erreur est survenue lors de la recherche du client",
        stack: e,
        success: false,
      });
      return;
    }

    //On verifie que le responsable existe bien et bon role
    let DataResponsable;
    try {
      DataResponsable = await UtilisateursSchema.findOne({
        email: req.body.responsable,
      });
      if (!DataResponsable) {
        res.json({
          erreur:
            "Le responsable " +
            req.body.responsable +
            " n'existe pas dans la base de donnée. Veuillez rentrer un client existant, ou creer un client avec ce mail",
          success: false,
        });
        return;
      }
      if (DataResponsable.role == "collaborateur") {
        res.json({
          erreur:
            "Le responsable " +
            req.body.responsable +
            " n'a pas le droit d'être responsable de projet",
          success: false,
        });
        return;
      }
    } catch (e) {
      console.error(e);
      res.json({
        erreur: "Une erreur est survenue lors de la recherche du responsable",
        stack: e,
        success: false,
      });
      return;
    }

    //on convertit bien en Date
    try {
      req.body.dateDebutInit = new Date(req.body.dateDebutInit);
      req.body.dateFinInit = new Date(req.body.dateFinInit);
    } catch (e) {
      console.error(e);
      res.json({
        erreur:
          "Probleme lors du parsage des dates dateDebutInit et dateFinInit",
        stack: e,
        success: false,
      });
      return;
    }

    try {
      //on créé l'id manuellement pour le sauvegardé
      let ID = mongoose.Types.ObjectId();
      // On crée une instance du Model
      let NewProjet = new ProjetsSchema({
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
          chargeConsomme: 0, //Somme des soustaches
          chargeRestante: 0, //Somme des soustaches
          chargeInitiale: 0, //Somme des soustaches
          chargeEffective: 0, //Somme des soustaches
        },
        client: req.body.client,
      });
      await NewProjet.save();
      DataResponsable.listeProjets.push(ID);
      DataClient.listeProjets.push(ID);
      await DataResponsable.save();
      await DataClient.save();

      res.json({ message: "Le projet a bien été sauvegardé", success: true });
    } catch (e) {
      console.error(e);
      res.json({ erreur: "Une erreur est survenue", stack: e, success: false });
    }
  });

  /** Ajout d'un utilisateur
   * requiert un champ :
   * @nom
   * @prenom
   * @mdp
   * @email
   * @role
   * @tel
   * renvoie un objet avec success a true si reussite, renvoie un objet avec success a false si echec
   */
  app.post("/Ajout/Utilisateur", async (req, res) => {
    if (
      !req.body.nom ||
      !req.body.prenom ||
      !req.body.mdp ||
      !req.body.email ||
      !req.body.role ||
      !req.body.tel
    ) {
      res.json({
        erreur:
          "Requete non valide. veuillez remplir les champs nom, prenom, mdp, email, role et tel",
        success: false,
      });
      return;
    }
    if (
      req.body.role != "administrateur" &&
      req.body.role != "responsable de projet" &&
      req.body.role != "collaborateur"
    ) {
      res.json({
        erreur:
          "Champ role non valide. il ne peut prendre que les valeurs 'administrateur', 'responsable de projet' ou 'collaborateur' (tout en minuscule!)",
        success: false,
      });
      return;
    }

    //On verifie que le mail n'existe pas deja
    try {
      let DataResponsable = await UtilisateursSchema.findOne({
        email: req.body.email,
      });
      if (DataResponsable) {
        res.json({
          erreur:
            "L'utilisateur avec le mail " +
            req.body.email +
            " existe deja dans la base de donnée",
          success: false,
        });
        return;
      }
    } catch (e) {
      console.error(e);
      res.json({
        erreur:
          "Une erreur est survenue lors de la recherche d'utilisateur unique",
        stack: e,
        success: false,
      });
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
        listeTacheResponsable: [],
        listeTacheCollaborateur: [],
        listeNotifications: [],
        listePojetsTermines: [],
        listeTachesTermines: [],
        listeTacheCommences: [],
      });

      await NewUtilisateur.save();
      res.json({
        message: "L'utilisateur a bien été sauvegardé",
        success: true,
      });
    } catch (e) {
      res.json({ erreur: "Une erreur est survenue", stack: e, success: false });
    }
  });

  /** Ajout d'un client
   * requiert un champ :
   * @nomEntreprise
   * @tel
   * @email
   * @contactsAssocies
   * renvoie un objet avec success a true si reussite, renvoie un objet avec success a false si echec
   */
  app.post("/Ajout/Client", async (req, res) => {
    if (!req.body.nomEntreprise || !req.body.tel || !req.body.email) {
      res.json({
        erreur:
          "Requete non valide. veuillez remplir les champs nomEntreprise, email et tel",
        success: false,
      });
      return;
    }

    try {
      // On crée une instance du Model
      var NewClient = new ClientsSchema({
        nomEntreprise: req.body.nomEntreprise,
        email: req.body.email,
        tel: req.body.tel,
        contactsAssocies: req.body.contactsAssocies
          ? req.body.contactsAssocies
          : [],
      });

      await NewClient.save();
      res.json({ message: "Le client a bien été sauvegardé", success: true });
    } catch (e) {
      res.json({ erreur: "Une erreur est survenue", stack: e, success: false });
    }
  });
};
