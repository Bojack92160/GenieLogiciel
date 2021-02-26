var mongoose = require('mongoose');
require('./DatePrototypes.js');
const UtilisateursSchema = require('./../models/Utilisateurs-model.js');
const ClientsSchema = require('./../models/Clients-model.js');
const ProjetsSchema = require('./../models/Projets-model.js');
const TachesSchema = require('./../models/Taches-model.js');
const NotificationsSchema = require('./../models/Notifications-model.js');
var NotificationTools = require('./NotificationTools.js');

module.exports = {

  getAllDataUnderTache: async function(id){
    let AllData = [];
    let DataMere = await ProjetsSchema.findById(id);

    if (!DataMere) {
      DataMere = await TachesSchema.findById(id);
      if (!DataMere) {
        throw "impossible de récupérer la datamere";
      }
    }

    AllData.push(DataMere);
    let NewData = [];
    for (var i = 0; i < DataMere.listeSousTaches.length; i++) {
      NewData.push(await getAllDataUnderTache(DataMere.listeSousTaches[i]));
    }
    AllData = AllData.concat(NewData);
    try {
      AllData = AllData.flatyflat(2);
    } catch (e) {
      console.error(e);
      console.log("AllData", AllData);
      throw e;
    }

    return AllData;
  },

  /**  renvoi un string contenant le chemin de cette Tache SANS SON TITRE
   * throw erreur si l'un des parents n'est pas accessible (mauvais id)
   */
  getChemin: async function(id){
    let chemin = "";
    while (true) {
      let DataMere = await TachesSchema.findById(id);
      if (!DataMere) {
        DataMere = await ProjetsSchema.findById(id);
        if (!DataMere) {
          throw "impossible de récupérer les données du projet/tache mere pour avoir le chemin";
        } else {
          chemin = DataMere.titre+"/"+chemin;
          break;
        }
      } else {
        chemin = DataMere.titre+"/"+chemin;
        id = DataMere._idMere;
      }
      DataMere = false;
    }
    return chemin;
  },

  /** si une tache/projet est a 100% d'avancement, elle disparait des listes du responsable/collaborateur
   * FONCTIONNE AVEC TACHE ET PROJET!!
   */
  closeTacheFinished: async function(idTache){
    console.log("---------------DEBUG----------------");
    try {
      let Data = await TachesSchema.findById(idTache);
      if (!Data) {
        Data = await ProjetsSchema.findById(idTache);
        if (!Data) {
          return false;
        }
      }
      console.log("Data", Data);
      if (Data.dataAvancement.pourcent>=1) {
        let DataResponsable = await UtilisateursSchema.findOne({email: Data.responsable});
        if (!DataResponsable) {
          return false;
        }
        if (DataResponsable.listeTacheResponsable.indexOf(Data._id)!=-1) {
          DataResponsable.listeTacheResponsable.splice(DataResponsable.listeTacheResponsable.indexOf(Data._id),1);
          DataResponsable.listeTachesTermines.push(Data._id);
          await DataResponsable.save()
          await NotificationTools.sendSystemNotification(DataResponsable.email, "la tache "+Data.chemin+Data.titre+" vient d'etre termine!");
        } else if (DataResponsable.listeProjets.indexOf(Data._id)!=-1) {
          DataResponsable.listeProjets.splice(DataResponsable.listeTacheResponsable.indexOf(Data._id),1);
          DataResponsable.listePojetsTermines.push(Data._id);
          await DataResponsable.save()
          await NotificationTools.sendSystemNotification(DataResponsable.email, "le projet "+Data.titre+" vient d'etre termine!");
        }
        if (Data.collaborateur && Data.collaborateur != "") {
          let DataCollaborateur = await UtilisateursSchema.findOne({email: Data.collaborateur});
          console.log("DataCollaborateur", DataCollaborateur);
          if (!DataCollaborateur) {
            return false;
          }
          if (DataCollaborateur.listeTacheCollaborateur.indexOf(Data._id)!=-1) {
            DataCollaborateur.listeTacheCollaborateur.splice(DataCollaborateur.listeTacheCollaborateur.indexOf(Data._id),1);
            DataCollaborateur.listeTachesTermines.push(Data._id);
            await DataCollaborateur.save()
            await NotificationTools.sendSystemNotification(DataCollaborateur.email, "la tache "+Data.chemin+Data.titre+" vient d'etre termine!");
          }
        }
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.error(e);
      return false;
    }
    return true;

  },

  /** Update les parents de cette tache en fonction de cette tache :
   * Update le dataAvancement
   * Update les dateDebutEffect/FinEffect SI depacement! + envoi une notification au responsable de la tache/projet en question (et collab si existant)
   */
  updateProjetFromTache: async function(idTache){
    try {
      console.log("go");
      let DataTacheFille = await TachesSchema.findById(idTache);
      let IdMere = DataTacheFille._idMere;
      let KeepGoing = true;

      while (KeepGoing) {
        let DataTacheMere = await TachesSchema.findById(IdMere);
        if (!DataTacheMere) {
          DataTacheMere = await ProjetsSchema.findById(IdMere);
          if (!DataTacheMere) {
            console.error("[updateProjet] impossible de trouver le projet/tache mere ",IdMere);
            return false;
          }
          KeepGoing = false;
        }


        let NombreDeFille = 0;
        let SommeDesPourcent = 0;
         DataTacheMere.dataAvancement.chargeConsomme = 0;
         DataTacheMere.dataAvancement.chargeRestante = 0;
         DataTacheMere.dataAvancement.chargeInitiale = 0;
         DataTacheMere.dataAvancement.chargeEffective = 0;
        for (var i = 0; i < DataTacheMere.listeSousTaches.length; i++) {
          let DataSousTache = await TachesSchema.findById(DataTacheMere.listeSousTaches[i]);
          if (!DataSousTache) {
            console.error("[updateProjet] impossible de trouver la soustaches pour le dataAvancement ");
            return false;
          }

          /************ on update les dates de debut et de fin*************/
          if (DataTacheMere.dateDebutEffect>DataSousTache.dateDebutEffect) {
            DataTacheMere.dateDebutEffect = new Date(DataSousTache.dateDebutEffect);
          }
          if (DataTacheMere.dateFinEffect<DataSousTache.dateFinEffect) {
            DataTacheMere.dateFinEffect = new Date(DataSousTache.dateFinEffect);
            if (DataTacheMere.dateFinEffect>DataTacheMere.dateFinInit) {
              await NotificationTools.sendSystemNotification(DataTacheMere.responsable, "la tache "+DataTacheMere.chemin+DataTacheMere.titre+" a du retard. date de fin effective:"+DataTacheMere.dateFinEffect.getOKLMDate()+", date de fin initiale:"+DataTacheMere.dateFinInit.getOKLMDate());
            }
          }

          /********** on update le dataAvancement ***********/
          NombreDeFille++;
          SommeDesPourcent += DataSousTache.dataAvancement.pourcent;
          DataTacheMere.dataAvancement.chargeConsomme += DataSousTache.dataAvancement.chargeConsomme;
          DataTacheMere.dataAvancement.chargeRestante += DataSousTache.dataAvancement.chargeRestante;
          DataTacheMere.dataAvancement.chargeInitiale += DataSousTache.dataAvancement.chargeInitiale;
          DataTacheMere.dataAvancement.chargeEffective += DataSousTache.dataAvancement.chargeEffective;
        }
        DataTacheMere.dataAvancement.pourcent = SommeDesPourcent/NombreDeFille;
        if (DataTacheMere.dataAvancement.pourcent>=1) {
          closeTacheFinished(DataTacheMere._id);
        }

        //on monte d'un niveau
        await DataTacheMere.save()
        if (KeepGoing) {
          IdMere = DataTacheMere._idMere;
          DataTacheFille = DataTacheMere;
        }
      }
      return true;
    } catch (e) {
      throw e;
      return false;
    }

  }
}


async function closeTacheFinished(idTache){
  try {
    let Data = await TachesSchema.findById(idTache);
    if (!Data) {
      Data = await ProjetsSchema.findById(idTache);
      if (!Data) {
        return false;
      }
    }
    if (Data.dataAvancement.pourcent>=1) {
      let DataResponsable = await UtilisateursSchema.findOne({email: Data.responsable});
      if (!DataResponsable) {
        return false;
      }
      if (DataResponsable.listeTacheResponsable.indexOf(Data._id)!=-1) {
        DataResponsable.listeTacheResponsable.splice(DataResponsable.listeTacheResponsable.indexOf(Data._id),1);
        DataResponsable.listeTachesTermines.push(Data._id);
        await DataResponsable.save()
        await NotificationTools.sendSystemNotification(DataResponsable.email, "la tache "+Data.chemin+Data.titre+" vient d'etre termine!");
      } else if (DataResponsable.listeProjets.indexOf(Data._id)!=-1) {
        DataResponsable.listeProjets.splice(DataResponsable.listeTacheResponsable.indexOf(Data._id),1);
        DataResponsable.listePojetsTermines.push(Data._id);
        await DataResponsable.save()
        await NotificationTools.sendSystemNotification(DataResponsable.email, "le projet "+Data.titre+" vient d'etre termine!");
      }
      if (Data.collaborateur && Data.collaborateur != "") {
        let DataCollaborateur = await UtilisateursSchema.findOne({email: Data.responsable});
        if (!DataCollaborateur) {
          return false;
        }
        if (DataCollaborateur.listeTacheCollaborateur.indexOf(Data._id)!=-1) {
          DataCollaborateur.listeTacheCollaborateur.splice(DataCollaborateur.listeTacheCollaborateur.indexOf(Data._id),1);
          DataCollaborateur.listeTachesTermines.push(Data._id);
          await DataCollaborateur.save()
          await NotificationTools.sendSystemNotification(DataCollaborateur.email, "la tache "+Data.chemin+Data.titre+" vient d'etre termine!");
        }
      }
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.error(e);
    return false;
  }
  return true;
}



async function getAllDataUnderTache(id){
  let AllData = [];
  let DataMere = await ProjetsSchema.findById(id);

  if (!DataMere) {
    DataMere = await TachesSchema.findById(id);
    if (!DataMere) {
      throw "impossible de récupérer la datamere";
    }
  }

  AllData.push(DataMere);
  let NewData = [];
  for (var i = 0; i < DataMere.listeSousTaches.length; i++) {
    NewData.push(await getAllDataUnderTache(DataMere.listeSousTaches[i]));
  }
  AllData = AllData.concat(NewData);
  try {
    AllData = AllData.flatyflat(2);
  } catch (e) {
    console.error(e);
    console.log("AllData", AllData);
    throw e;
  }
  return AllData;
}

Object.defineProperty(Array.prototype, 'flatyflat', {
    value: function(depth = 1) {
      return this.reduce(function (flatyflat, toFlatten) {
        return flatyflat.concat((Array.isArray(toFlatten) && (depth>1)) ? toFlatten.flatyflat(depth-1) : toFlatten);
      }, []);
    }
});
