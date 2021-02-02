var mongoose = require('mongoose');
const UtilisateursSchema = require('./../models/Utilisateurs-model.js');
const ClientsSchema = require('./../models/Clients-model.js');
const ProjetsSchema = require('./../models/Projets-model.js');
const TachesSchema = require('./../models/Taches-model.js');
const NotificationsSchema = require('./../models/Notifications-model.js');


module.exports = {

  //envoi une notification systeme au destinataire
  sendSystemNotification: async function(destinataire, contenu){
    let DataDestinataire;
    try {
      DataDestinataire = await UtilisateursSchema.findOne({email: destinataire});
      if (!DataDestinataire) {
        return false;
      }
    } catch (e) {
      return false;
    }
    try {
      let ID = mongoose.Types.ObjectId();
      // On crée une instance du Model
      var NewNotification = new NotificationsSchema({
        _id: ID,
        de: "SYSTEM",
        pour: destinataire,
        _idde: "00000", //todo?
        _idpour: DataDestinataire._id,
        contenu: contenu,
        date: new Date(),
      });
      DataDestinataire.listeNotifications.push(ID);
      await NewNotification.save();
      await DataDestinataire.save()
      return true;
    } catch (e) {
      return false;
    }
  }





}
