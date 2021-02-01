const mongoose = require('mongoose');

const Projets = mongoose.Schema({
  titre: String,
  responsable: String, //email
  description: String,
  dateDebutInit: Date,
  dateFinInit: Date,
  dateDebutEffect: Date,
  dateFinEffect: Date,
  listeSousTaches: [String], //list d'id
  dataAvancement: {
  	pourcent: Number, //entre 0 et 1
  	chargeConsommé: Number, //Somme des soustaches
  	chargeRestante: Number, //Somme des soustaches
  	chargeInitiale: Number, //Somme des soustaches
  	chargeEffective: Number, //Somme des soustaches
  },
  client: String, //email du client
});

module.exports = mongoose.model('Projets', Projets);
