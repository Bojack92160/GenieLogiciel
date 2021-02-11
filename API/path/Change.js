var mongoose = require('mongoose');

const UtilisateursSchema = require('./../models/Utilisateurs-model.js');
const ClientsSchema = require('./../models/Clients-model.js');
const ProjetsSchema = require('./../models/Projets-model.js');
const NotificationsSchema = require('./../models/Notifications-model.js');
const TachesSchema = require('./../models/Taches-model.js');

var TachesTools = require('./../tools/TachesTools.js');
var NotificationTools = require('./../tools/NotificationTools.js');

module.exports = function(app){

  /** Pour change le champ 'responsable' d'un projet
  * nécessite les champs:
   * @idProjet
   * @emailNewResponsable
   * l'ancien responsable PEUT ne plus exister dans la BDD
   * le nouveau responsable et le projet doit exister
   *
   */
  app.post("/Change/ProjetResponsable", async (req, res) => {
    if (!req.body.idProjet || !req.body.emailNewResponsable) {
      res.json({erreur: "Requete non valide. veuillez remplir les champs idProjet et emailNewResponsable", success: false});
      return;
    }

    let DataProjet;
    try {
      DataProjet = await ProjetsSchema.findById(req.body.idProjet);
      if (!DataProjet) {
        res.json({
          erreur: "Aucun projet ne correspond a cet id (" + req.body.idProjet + ")",
          success: false,
        });
        return;
      }
    } catch (e) {
      console.error(e);
      res.json({ erreur: "Une erreur est survenue", stack: e, success: false });
      return;
    }

    let NewResponsable;
    try {
        NewResponsable = await UtilisateursSchema.findOne({"email" : req.body.emailNewResponsable});
        if (!NewResponsable) {
          res.json({
            erreur: "Aucun utilsateur ne correspond a cet email (" + req.body.emailNewResponsable + ")",
            success: false,
          });
          return;
        } else if (NewResponsable.role == "collaborateur") {
          res.json({erreur: "Le responsable "+req.body.emailNewResponsable+" n'a pas le droit d'être responsable de projet", success: false});
          return;
        }
    } catch (e) {
      console.error(e);
      res.json({ erreur: "Une erreur est survenue", stack: e, success: false });
      return;
    }

    try {
      let OldResponsable = await UtilisateursSchema.findOne({"email" : DataProjet.responsable});
      if (OldResponsable) { //au cas ou il existe plus
        let index = OldResponsable.listeProjets.indexOf(DataProjet._id);
        OldResponsable.listeProjets.splice(index, 1);
        await OldResponsable.save();
      }
      NewResponsable.listeProjets.push(DataProjet._id);
      await NewResponsable.save();
      DataProjet.responsable = req.body.emailNewResponsable;
      await DataProjet.save();
      await NotificationTools.sendSystemNotification(OldResponsable.email, "Vous n'etes plus responsable du projet "+DataProjet.titre+", "+req.body.emailNewResponsable+" a prit votre place!");
      await NotificationTools.sendSystemNotification(NewResponsable.email, "Vous etes responsable du projet "+DataProjet.titre+" !");
      res.json({ message: "Responsable changé avec succes!", success: false });
      return;
    } catch (e) {
      console.error(e);
      res.json({ erreur: "Une erreur est survenue", stack: e, success: false });
      return;
    }
  });

  /** Pour change le champ 'responsable' d'une tache
  * nécessite les champs:
   * @idTache
   * @emailNewResponsable
   * l'ancien responsable PEUT ne plus exister dans la BDD
   * le nouveau responsable et la tache doit exister
   *
   */
  app.post("/Change/TacheResponsable", async (req, res) => {
    if (!req.body.idTache || !req.body.emailNewResponsable) {
      res.json({erreur: "Requete non valide. veuillez remplir les champs idTache et emailNewResponsable", success: false});
      return;
    }

    let DataTache;
    try {
      DataTache = await TachesSchema.findById(req.body.idTache);
      if (!DataTache) {
        res.json({
          erreur: "Aucune tache ne correspond a cet id (" + req.body.idTache + ")",
          success: false,
        });
        return;
      }
    } catch (e) {
      console.error(e);
      res.json({ erreur: "Une erreur est survenue", stack: e, success: false });
      return;
    }

    let NewResponsable;
    try {
        NewResponsable = await UtilisateursSchema.findOne({"email" : req.body.emailNewResponsable});
        if (!NewResponsable) {
          res.json({
            erreur: "Aucun utilsateur ne correspond a cet email (" + req.body.emailNewResponsable + ")",
            success: false,
          });
          return;
        } else if (NewResponsable.role == "collaborateur") {
          res.json({erreur: "Le responsable "+req.body.emailNewResponsable+" n'a pas le droit d'être responsable de tache", success: false});
          return;
        }
    } catch (e) {
      console.error(e);
      res.json({ erreur: "Une erreur est survenue", stack: e, success: false });
      return;
    }

    try {
      let OldResponsable = await UtilisateursSchema.findOne({"email" : DataTache.responsable});
      if (OldResponsable) { //au cas ou il existe plus
        let index = OldResponsable.listeTacheResponsable.indexOf(DataTache._id);
        OldResponsable.listeTacheResponsable.splice(index, 1);
        await OldResponsable.save();
      }
      NewResponsable.listeTacheResponsable.push(DataTache._id);
      await NewResponsable.save();
      DataTache.responsable = req.body.emailNewResponsable;
      await DataTache.save();
      await NotificationTools.sendSystemNotification(OldResponsable.email, "Vous n'etes plus responsable de la tache "+DataTache.chemin+DataTache.titre+", "+req.body.emailNewResponsable+" a prit votre place!");
      await NotificationTools.sendSystemNotification(NewResponsable.email, "Vous etes responsable de la tache "+DataTache.chemin+DataTache.titre+" !");

      res.json({ message: "Responsable changé avec succes!", success: false });
      return;
    } catch (e) {
      console.error(e);
      res.json({ erreur: "Une erreur est survenue", stack: e, success: false });
      return;
    }
  });


  /** Pour changer le champ 'collaborateur' d'une tache
  * nécessite les champs:
   * @idTache
   * @emailNewCollaborateur
   * l'ancien responsable PEUT ne plus exister dans la BDD
   * le nouveau responsable et la tache doit exister
   * la tache ne doit pas avoir de sous tache
   *
   */
  app.post("/Change/TacheCollaborateur", async (req, res) => {
    if (!req.body.idTache || !req.body.emailNewCollaborateur) {
      res.json({erreur: "Requete non valide. veuillez remplir les champs idTache et emailNewCollaborateur", success: false});
      return;
    }

    let DataTache;
    try {
      DataTache = await TachesSchema.findById(req.body.idTache);
      if (!DataTache) {
        res.json({
          erreur: "Aucune tache ne correspond a cet id (" + req.body.idTache + ")",
          success: false,
        });
        return;
      } else if (DataTache.listeSousTaches.length>0) {
        res.json({
          erreur: "Impossible d'affecter un nouveau collaborateur a une tache possedant des sous taches! les collaborateurs peuvent etre affecté uniquement sur des taches du plus bas niveau ",
          success: false,
        });
        return;
      }
    } catch (e) {
      console.error(e);
      res.json({ erreur: "Une erreur est survenue", stack: e, success: false });
      return;
    }

    let NewCollaborateur;
    try {
        NewCollaborateur = await UtilisateursSchema.findOne({"email" : req.body.emailNewCollaborateur});
        if (!NewCollaborateur) {
          res.json({
            erreur: "Aucun utilsateur ne correspond a cet email (" + req.body.emailNewCollaborateur + ")",
            success: false,
          });
          return;
        }
    } catch (e) {
      console.error(e);
      res.json({ erreur: "Une erreur est survenue", stack: e, success: false });
      return;
    }

    try {
      let OldResponsable = await UtilisateursSchema.findOne({"email" : DataTache.responsable});
      if (OldResponsable) { //au cas ou il existe plus
        let index = OldResponsable.listeTacheCollaborateur.indexOf(DataTache._id);
        OldResponsable.listeTacheCollaborateur.splice(index, 1);
        await OldResponsable.save();
      }
      DataTache.collaborateur = req.body.emailNewCollaborateur;
      NewCollaborateur.listeTacheCollaborateur.push(DataTache._id); //on update le nouveau responsable
      await NewCollaborateur.save();
      await DataTache.save();
      await NotificationTools.sendSystemNotification(OldResponsable.email, "Vous n'etes plus collaborateur de la tache "+DataTache.chemin+DataTache.titre+", "+req.body.emailNewCollaborateur+" a prit votre place!");
      await NotificationTools.sendSystemNotification(NewCollaborateur.email, "Vous etes collaborateur de la tache "+DataTache.chemin+DataTache.titre+" !");
      res.json({ message: "Tache changé avec succes!", success: false });
      return;
    } catch (e) {
      console.error(e);
      res.json({ erreur: "Une erreur est survenue", stack: e, success: false });
      return;
    }
  });

  /** Pour changer les datas d'un utilisateur
  * nécessite le champs:
  * @_idUtilisateur
  * peut contenir les champs:
  * @nom
  * @prenom
  * @mdp
  * @role
  * @tel
  */
    app.post("/Change/DataUtilisateur", async (req, res) => {
      if (!req.body._idUtilisateur) {
        res.json({erreur: "Requete non valide. veuillez remplir le champs _idUtilisateur", success: false});
        return;
      }

      let DataUtilisateur;
      try {
          DataUtilisateur = await UtilisateursSchema.findById(req.body._idUtilisateur);
          if (!DataUtilisateur) {
            res.json({
              erreur: "Aucun utilsateur ne correspond a cet id (" + req.body._idUtilisateur + ")",
              success: false,
            });
            return;
          }
      } catch (e) {
        console.error(e);
        res.json({ erreur: "Une erreur est survenue", stack: e, success: false });
        return;
      }

      if (req.body.nom) {
        DataUtilisateur.nom = req.body.nom;
      }
      if (req.body.prenom) {
        DataUtilisateur.prenom = req.body.prenom;
      }
      if (req.body.mdp) {
        DataUtilisateur.mdp = req.body.mdp;
      }
      if (req.body.role) {
        if (req.body.role!="administrateur" && req.body.role!="responsable de projet" && req.body.role!="collaborateur") {
          res.json({erreur: "Champ 'role' non valide. il ne peut prendre que les valeurs 'administrateur', 'responsable de projet' ou 'collaborateur' (tout en minuscule!)", success: false});
          return;
        }
        if (req.body.role=="collaborateur" && (DataUtilisateur.listeProjets.length>0 || DataUtilisateur.listeProjets.listeTacheResponsable>0)) {
          res.json({erreur: "Impossible de mettre son role a collaborateur tant que cet utilisateur est responsable de projets/taches!", success: false});
          return;
        }
        DataUtilisateur.role = req.body.role;
      }
      if (req.body.tel) {
        if (typeof req.body.tel == 'number') {
          DataUtilisateur.tel = req.body.tel;
        } else {
          res.json({ erreur: "le champ 'tel' doit etre de type 'number'", stack: e, success: false });
          return;
        }
      }

      await DataUtilisateur.save();
      await NotificationTools.sendSystemNotification(DataUtilisateur.email, "Vos informations personnelles ont été modifié");
      res.json({message: "l'utilisateur a bien été modifié!", success: true});
      return;
    });

}
