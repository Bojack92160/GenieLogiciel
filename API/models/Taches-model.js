const mongoose = require('mongoose');

const Projets = mongoose.Schema({
  titre: String,
  responsable: String, //email
  description: String,
  dateDebutInit: Date,
  dateFinInit: Date,
  dateDebutEffect: Date,
  dateFinEffect: Date,
  niveau: Number,
  chemin: String,
  _idMere: Number,
  listeSousTaches: [String], //list d'id
  collaborateur: String,
  dataAvancement: {
  	pourcent: Number, //entre 0 et 1
  	chargeConsommé: Number, //Somme des soustaches
  	chargeRestante: Number, //Somme des soustaches
  	chargeInitiale: Number, //Somme des soustaches
  	chargeEffective: Number, //Somme des soustaches
  },
  prédécesseurs: [String],
  sAlerte: {
      type: Boolean ,
      default: true
    },
});

module.exports = mongoose.model('Projets', Projets);
