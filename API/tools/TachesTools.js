var mongoose = require('mongoose');
require('./DatePrototypes.js');
const UtilisateursSchema = require('./../models/Utilisateurs-model.js');
const ClientsSchema = require('./../models/Clients-model.js');
const ProjetsSchema = require('./../models/Projets-model.js');
const TachesSchema = require('./../models/Taches-model.js');
const NotificationsSchema = require('./../models/Notifications-model.js');
var NotificationTools = require('./NotificationTools.js');

module.exports = {

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

  /** Update les parents de cette tache en fonction de cette tache :
   * Update le dataAvancement
   * Update les dateDebutEffect/FinEffect SI depacement! + envoi une notification au responsable de la tache/projet en question
   */
  updateProjetFromTache: async function(idTache){
    try {
      console.log("go");
      let DataTacheFille = await TachesSchema.findById(idTache);
      let IdMere = DataTacheFille._idMere;
      let KeepGoing = true;

      while (KeepGoing) {
        console.log("boucle", DataTacheFille);
        let DataTacheMere = await TachesSchema.findById(IdMere);
        console.log("DataTacheMere debut", DataTacheMere);
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
          console.log("soustache",i,DataSousTache);
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

        //on monte d'un niveau
        console.log("DataTacheMere fin", DataTacheMere);
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
