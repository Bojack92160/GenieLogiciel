var mongoose = require('mongoose');
const UtilisateursSchema = require('./../models/Utilisateurs-model.js');
const ClientsSchema = require('./../models/Clients-model.js');
const ProjetsSchema = require('./../models/Projets-model.js');
const TachesSchema = require('./../models/Taches-model.js');
const NotificationsSchema = require('./../models/Notifications-model.js');


module.exports = {

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
  }





}
