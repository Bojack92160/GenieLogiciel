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
});

/** Supprime un client
* necessite le champ:
* @id
 * Il faut que le client n'ai aucun projet un cours
 */
app.post("/Supprime/Client", async (req, res) => {

  if (!req.body.id) {
    res.json({erreur: "Requete non valide. veuillez remplir le champs id", success: false});
    return;
  }

  let ClientData;
  try {
    ClientData = await ClientsSchema.findById(req.body.id);
    console.log(ClientData);
    if (!ClientData) {
      res.json({erreur: "Ce client n'existe pas. Veuillez renseignez l'id d'un client existant", success: false});
      return;
    }
  } catch (e) {
    console.error(e);
    res.json({erreur: "Une erreur est survenue lors du findById", stack:e, success: false});
    return;
  }

  //verif que le client n'a pas de projet
  if (ClientData.listeProjets.length>0) {
    res.json({erreur: "Vous ne pouvez pas supprimez un client ayant des projets en cours!", success: false});
    return;
  }

  await ClientsSchema.findByIdAndDelete(req.body.id);
  res.json({message: "Le client a été supprimé avec succes!", success: true});
  return;
});


/** Supprime une tache




*/
app.post("/Supprime/Tache", async (req, res) => {
  if (!req.body.id) {
    res.json({erreur: "Requete non valide. veuillez remplir le champs id", success: false});
    return;
  }

  let TacheData;
  try {
    TacheData = await TachesSchema.findById(req.body.id);
    if (!TacheData) {
      res.json({erreur: "Cette tachen'existe pas. Veuillez renseignez l'id d'une tache existant", success: false});
      return;
    }
  } catch (e) {
    console.error(e);
    res.json({erreur: "Une erreur est survenue lors du findById", stack:e, success: false});
    return;
  }

  if (TacheData.dataAvancement.pourcent == 0) {
    let AllDataTache
    try {
       AllDataTache = await TachesTools.getAllDataUnderTache(req.body.id);
    } catch (e) {
      console.error(e);
      res.json({erreur: "Un erreur est survenue lors de la recupération des sous taches du projet non commencé", success: false});
      return;
    }

    //on envoie une notification a tt le monde pour montrer que le projet est sup, et on supprime la tache
    try {
      for (var i = 0; i < AllDataTache.length; i++) {
        console.log("AllDataTache", AllDataTache);
        if (AllDataTache[i]._id == TacheData._id) {
          continue
        }
        await NotificationTools.sendSystemNotification(AllDataTache[i].responsable, " Attention! La tache '"+TacheData.titre+"' va etre supprimé! par conséquent, la tache dont vous étiez responsable ("+AllDataTache[i].titre+") va elle aussi etre supprimé. Pas d'inquiétude, aucun travaille n'avais été effectué ");
        let DataResponsable = await UtilisateursSchema.findOne({email: AllDataTache[i].responsable});
        DataResponsable.listeTacheResponsable.splice(DataResponsable.listeTacheResponsable.indexOf(AllDataTache[i]._id),1);
        await DataResponsable.save();
        if (AllDataTache[i].collaborateur != "") {
          await NotificationTools.sendSystemNotification(AllDataTache[i].responsable, " Attention! La tache '"+TacheData.titre+"' va etre supprimé! par conséquent, la tache dont vous étiez collaborateur ("+AllDataTache[i].titre+") va elle aussi etre supprimé. Pas d'inquiétude, aucun travaille n'avais été effectué ");
          let DataCollab = await UtilisateursSchema.findOne({email: AllDataTache[i].collaborateur});
          DataCollab.listeTacheCollaborateur.splice(DataCollab.listeTacheCollaborateur.indexOf(AllDataTache[i]._id),1);
          await DataCollab.save();
        }
        await TachesSchema.findByIdAndDelete(AllDataTache[i]._id);
      }
    } catch (e) {
      console.error(e);
      res.json({erreur: "Un erreur est survenue lors de la suppretion des sous taches. ATTENTION, certaine tache ont pu etre supprimé!", success: false});
      return;
    }


    await NotificationTools.sendSystemNotification(TacheData.responsable, " Attention! La tache '"+TacheData.titre+"' a été supprimé ainsi que toute ses sous taches!");
    await TachesSchema.findByIdAndDelete(req.body.id);
    res.json({message: "Le projet et toute ses sous taches ont bien été supprimé", success: true});
    return;

  } else {
    if (TacheData.listeSousTaches.length>0) {
      res.json({erreur: "Une tache ayant des sous taches dont on a déjà travaillé dessus ne peut pas etre supprimé! veuillez supprimer la sous tache en premier", success: false});
      return;
    }



    //on update collab et responsable
    try {
      await NotificationTools.sendSystemNotification(TacheData.responsable, " Attention! la tache dont vous étiez collaborateur ("+TacheData.titre+") va etre considéré comme ambandonné");
      let DataResponsable = await UtilisateursSchema.findOne({email: TacheData.responsable});
      DataResponsable.listeTacheResponsable.splice(DataResponsable.listeTacheResponsable.indexOf(TacheData._id),1);
      await DataResponsable.save();
      if (TacheData.collaborateur != "") {
        await NotificationTools.sendSystemNotification(TacheData.collaborateur, " Attention! la tache dont vous étiez collaborateur ("+TacheData.titre+") va etre considéré comme ambandonné");
        let DataCollab = await UtilisateursSchema.findOne({email: TacheData.collaborateur});
        DataCollab.listeTacheCollaborateur.splice(DataCollab.listeTacheCollaborateur.indexOf(TacheData._id),1);
        await DataCollab.save();
      }
    } catch (e) {
      res.json({erreur: "Erreur lors de l'update du responsable / collaborateur", success: false});
      return;
    }

    //on update la tache mere
    let DataTacheMere = TachesSchema.findById(TacheData._idMere)
    if (!DataTacheMere) {
      DataTacheMere = ProjetsSchema.findById(TacheData._idMere)
    }
    if (!DataTacheMere) {
      res.json({erreur: "Impossible de trouver la tache mere! donc impossible de l'update", success: false});
      return;
    }

    DataTacheMere.listeSousTaches.splice(DataTacheMere.listeSousTaches.indexOf(TacheData._id), 1);
    await DataTacheMere.save();

    //on la fait passé en mode abandon
    TacheData.titre += " ABANDONNE";
    await TacheData.save();

    //verification si elle est prédécesseuse d'un autre
    try {
      for (var i = 0; i < DataTacheMere.listeSousTaches.length; i++) {
        let SousTache = TachesSchema.findById(DataTacheMere.listeSousTaches[i]);
        if (SousTache.prédécesseurs.includes(TacheData._id)) {
          SousTache.prédécesseurs.splice(SousTache.prédécesseurs.indexOf(TacheData._id), 1);
          await SousTache.save();
        }
      }
    } catch (e) {
      res.json({erreur: "Impossible de trouver des successeurs", success: false});
      return;
    }

    res.json({message: "tache abandonné avec succés", success:true})
    return;
  }
});




/** Supprime un projet
* Necessite le champ:
* @id
* si le projet n'a aucun avancement, le projet est bien supprimé
* sinon, il passe en mode terminé (abandonné).
* tout le monde est notifié
*
*/
app.post("/Supprime/Projet", async (req, res) => {

  if (!req.body.id) {
    res.json({erreur: "Requete non valide. veuillez remplir le champs id", success: false});
    return;
  }

  let ProjetData;
  try {
    ProjetData = await ProjetsSchema.findById(req.body.id);
    console.log(ProjetData);
    if (!ProjetData) {
      res.json({erreur: "Ce Projet n'existe pas. Veuillez renseignez l'id d'un projet existant", success: false});
      return;
    }
  } catch (e) {
    console.error(e);
    res.json({erreur: "Une erreur est survenue lors du findById", stack:e, success: false});
    return;
  }

  //cas où il n'y a aucun avancement donc c est ok
  if (ProjetData.dataAvancement.pourcent == 0) {
    let AllDataProject
    try {
       AllDataProject = await TachesTools.getAllDataUnderTache(req.body.id);
    } catch (e) {
      console.error(e);
      res.json({erreur: "Un erreur est survenue lors de la recupération des sous taches du projet non commencé", success: false});
      return;
    }

    //on envoie une notification a tt le monde pour montrer que le projet est sup, et on supprime la tache
    try {
      for (var i = 0; i < AllDataProject.length; i++) {
        if (AllDataProject[i]._id == ProjetData._id) {
          continue
        }
        await NotificationTools.sendSystemNotification(AllDataProject[i].responsable, " Attention! Le projet '"+ProjetData.titre+"' va etre supprimé! par conséquent, la tache dont vous étiez responsable ("+AllDataProject[i].titre+") va elle aussi etre supprimé. Pas d'inquiétude, aucun travaille n'avais été effectué ");
        let DataResponsable = await UtilisateursSchema.findOne({email: AllDataProject[i].responsable});
        DataResponsable.listeTacheResponsable.splice(DataResponsable.listeTacheResponsable.indexOf(AllDataProject[i]._id),1);
        await DataResponsable.save();
        if (AllDataProject[i].collaborateur != "") {
          await NotificationTools.sendSystemNotification(AllDataProject[i].responsable, " Attention! Le projet '"+ProjetData.titre+"' va etre supprimé! par conséquent, la tache dont vous étiez collaborateur ("+AllDataProject[i].titre+") va elle aussi etre supprimé. Pas d'inquiétude, aucun travaille n'avais été effectué ");
          let DataCollab = await UtilisateursSchema.findOne({email: AllDataProject[i].collaborateur});
          DataCollab.listeTacheCollaborateur.splice(DataCollab.listeTacheCollaborateur.indexOf(AllDataProject[i]._id),1);
          await DataCollab.save();
        }
        await TachesSchema.findByIdAndDelete(AllDataProject[i]._id);
      }
    } catch (e) {
      console.error(e);
      res.json({erreur: "Un erreur est survenue lors de la suppretion des sous taches. ATTENTION, certaine tache ont pu etre supprimé!", success: false});
      return;
    }

    //on update le responsable de projet
    try {
      let ProjetResponsable = await UtilisateursSchema.findOne({email: ProjetData.responsable});
      DataResponsable.listeProjets.splice(DataResponsable.listeProjets.indexOf(ProjetData._id),1);
      await DataResponsable.save();
    } catch (e) {
      console.error(e);
      res.json({erreur: "Un erreur est survenue lors de l'update du responsable de projet'. ATTENTION, les tache ont été supprimé!", success: false});
      return;
    }

    await NotificationTools.sendSystemNotification(ProjetData.responsable, " Attention! Le projet '"+ProjetData.titre+"' a été supprimé ainsi que toute ses sous taches!");
    await ProjetsSchema.findByIdAndDelete(req.body.id);
    res.json({message: "Le projet et toute ses sous taches ont bien été supprimé", success: true});
    return;
  } else {
    let AllDataProject
    try {
       AllDataProject = await TachesTools.getAllDataUnderTache(req.body.id);
    } catch (e) {
      console.error(e);
      res.json({erreur: "Un erreur est survenue lors de la recupération des sous taches du projet déjà commencé", success: false});
      return;
    }

    //on envoie une notification a tt le monde pour montrer que le projet est sup, et on abandonne la tache
    try {
      for (var i = 0; i < AllDataProject.length; i++) {
        if (AllDataProject[i]._id == ProjetData._id) {
          continue
        }
        await NotificationTools.sendSystemNotification(AllDataProject[i].responsable, " Attention! Le projet '"+ProjetData.titre+"' va etre supprimé! par conséquent, la tache dont vous étiez responsable ("+AllDataProject[i].titre+") va etre considéré comme ambandonné");
        let DataResponsable = await UtilisateursSchema.findOne({email: AllDataProject[i].responsable});
        DataResponsable.listeTacheResponsable.splice(DataResponsable.listeTacheResponsable.indexOf(AllDataProject[i]._id),1);
        DataResponsable.listeTachesTermines.push(AllDataProject[i]._id);
        await DataResponsable.save();
        if (AllDataProject[i].collaborateur != "") {
          await NotificationTools.sendSystemNotification(AllDataProject[i].responsable, " Attention! Le projet '"+ProjetData.titre+"' va etre supprimé! par conséquent, la tache dont vous étiez collaborateur ("+AllDataProject[i].titre+") va etre considéré comme ambandonn");
          let DataCollab = await UtilisateursSchema.findOne({email: AllDataProject[i].collaborateur});
          DataCollab.listeTacheCollaborateur.splice(DataCollab.listeTacheCollaborateur.indexOf(AllDataProject[i]._id),1);
          DataCollab.listeTachesTermines.push(AllDataProject[i]._id);
          await DataCollab.save();
        }
      }
    } catch (e) {
      console.error(e);
      res.json({erreur: "Un erreur est survenue lors de la suppretion des sous taches. ATTENTION, certaine tache ont pu etre supprimé!", success: false});
      return;
    }


    //on update le responsable de projet
    try {
      let ProjetResponsable = await UtilisateursSchema.findOne({email: ProjetData.responsable});
      DataResponsable.listeProjets.splice(DataResponsable.listeProjets.indexOf(ProjetData._id),1);
      DataResponsable.listePojetsTermines.push(ProjetData._id);
      await DataResponsable.save();
    } catch (e) {
      console.error(e);
      res.json({erreur: "Un erreur est survenue lors de l'update du responsable de projet'. ATTENTION, les tache ont été supprimé!", success: false});
      return;
    }

    await NotificationTools.sendSystemNotification(ProjetData.responsable, " Attention! Le projet '"+ProjetData.titre+"' a été abandonné ainsi que toute ses sous taches. Le travail effectué est toujours visible dans l'explorateur!");
    ProjetData.titre += "-- ABANDONNE --";
    await ProjetData.save();





    await ProjetsSchema.save();
    res.json({message: "Le projet et toute ses sous taches ont bien été supprimé", success: true});
    return;







    res.json({erreur: "Le projet contient des avancements déja fait! pas de prise en charge pour le moment", success: false});
    return;
  }

});

}
