const mongoose = require('mongoose');

const Projets = mongoose.Schema({
  titre: String,
  responsable: String,
  description: String,
  dateDebutInit: Date,
  dateFinInit: Date,
  dateDebutEffect: Date,
  dateFinEffect: Date,
  titre: String,
  listeSousTaches: [String], //list d'id
  dataAvancement: {
  	pourcent: Number, //entre 0 et 1
  	chargeConsommé: Number, //Somme des soustaches
  	chargeRestante: Number, //Somme des soustaches
  	chargeInitiale: Number, //Somme des soustaches
  	chargeEffective: Number, //Somme des soustaches
  },
  client: String,
});

module.exports = mongoose.model('Projets', Projets);
