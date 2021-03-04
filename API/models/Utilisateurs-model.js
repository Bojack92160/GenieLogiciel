const mongoose = require('mongoose');

const Utilisateurs = mongoose.Schema({
  nom: String,
  prenom: String,
  mdp: String,
  email: String,
  role: String,
  tel: Number,
  listeProjets: [String], //si responsable
  listeTacheResponsable: [String], //tache où il est responsable
  listeTacheCollaborateur: [String], //tache où il est collaborateur
  listeNotifications: [String],
  listePojetsTermines: [String],
  listeTachesTermines: [String],
  listeTacheCommences: [{
    _id: String,
    dateDebut: Date
  }]
});

module.exports = mongoose.model('Utilisateurs', Utilisateurs);
