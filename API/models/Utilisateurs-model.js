const mongoose = require('mongoose');

const Utilisateurs = mongoose.Schema({
  nom: String,
  prenom: String,
  mdp: String,
  email: String,
  role: String,
  tel: Number,
  listeProjets: [String],
  listeNotifications: [String],
  listeTacheCommencés: [{
    _id: String,
    dateDebut: Date
  }]
});

module.exports = mongoose.model('Utilisateurs', Utilisateurs);
