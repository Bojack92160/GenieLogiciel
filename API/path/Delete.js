var mongoose = require('mongoose');

const UtilisateursSchema = require('./../models/Utilisateurs-model.js');
const ClientsSchema = require('./../models/Clients-model.js');
const ProjetsSchema = require('./../models/Projets-model.js');
const NotificationsSchema = require('./../models/Notifications-model.js');
const TachesSchema = require('./../models/Taches-model.js');

var TachesTools = require('./../tools/TachesTools.js');
var NotificationTools = require('./../tools/NotificationTools.js');

module.exports = function(app){


/** Supprime un utilisateur
 * Necessite le champ:
 * @id
 * Ne modifie pas les taches/projet dans lequelles il est responsable/collaborateur, mais envoie une notification au responsable
 */
app.post("/Supprime/Utilisateur", async (req, res) => {
  if (!req.body.id) {
    res.json({erreur: "Requete non valide. veuillez remplir les champs id", success: false});
    return;
  }

  let DataUtilisateur;
  try {
    DataUtilisateur = await UtilisateursSchema.findById(req.body.id);
    if (!DataUtilisateur) {
      res.json({
        erreur: "Aucun element ne correspond a cet id (" + req.body.id + ")",
        success: false,
      });
      return;
    }
  } catch (e) {
    res.json({ erreur: "Une erreur est survenue", stack: e, success: false });
    return;
  }

  if (DataUtilisateur.listeProjets.length>0) {
    res.json({ erreur: "Action impossible. L'utilisateur que vous voulez supprimer est responsable d'au moins un projet. Il faut d'abord le désaffecté", stack: e, success: false });
    return;
  }
  console.log("on a l utilisateur :", DataUtilisateur);

  //on delete l utilisateur
  try {
    console.log('on supprime');
    await UtilisateursSchema.findByIdAndDelete(req.body.id)
  } catch (e) {
    res.json({ erreur: "Une erreur est survenue", stack: e, success: false });
    return;
  }

  try {
    //on recherche les responsables a notifier des taches meres duquel il est responsable
    for (var i = 0; i < DataUtilisateur.listeTacheResponsable.length; i++) {
      let DataTache = await TachesSchema.findById(DataUtilisateur.listeTacheResponsable[i]);
      if (!DataTache) {
        continue;
      }
      let DataTacheMere = await TachesSchema.findById(DataTache._idMere);
      if (!DataTacheMere) {
        DataTacheMere = await ProjetsSchema.findById(DataTache._idMere);
      }
      await NotificationTools.sendSystemNotification(DataTacheMere.responsable, "Le responsable de la tache fille '"+DataTache.titre+"' vient d'etre supprimé de la base de donnée! Il faudra changer de responsable pour cette tache");
    }

    //on recherche les responsables a notifier
    for (var i = 0; i < DataUtilisateur.listeTacheCollaborateur.length; i++) {
      let DataTache = await TachesSchema.findById(DataUtilisateur.listeTacheCollaborateur[i]);
      console.log("DataTache", DataTache);
      if (!DataTache) {
        continue;
      }
      await NotificationTools.sendSystemNotification(DataTache.responsable, "Le collaborateur de la tache '"+DataTache.titre+"' dont vous etes responsable vient d'etre supprimé de la base de donnée! Il faudra changer de collaborateur pour cette tache");
    }
  } catch (e) {
    res.json({ erreur: "Une erreur est survenue mais l'utilisateur a bien été supprimé de la base de donnée", stack: e, success: false });
    return;
  }

  res.json({ message: "l'utilisateur a bien été supprimé de la base de donnée", success:true});
  return;
})







}
