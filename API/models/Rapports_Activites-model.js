const mongoose = require('mongoose');

const Rapports_Activites = mongoose.Schema({
  _idUtilisateur: String,
  _idTache: String,
  emailUtilisateur: String,
  dateDeSaisie: Date,
  periodeDebut: Date,
  periodeFin: Date,
  chargeEffectue: Number,
  chargeRestante: Number, //=chargeEffectue * (1-avancementFinal)/avancementEffectué)
  avancecementInitial: Number, //entre 0 et 1 (pourcentage)
  avancementEffectué: Number,
  avancementFinal: Number,
  commentaire: String,
});

module.exports = mongoose.model('Rapports_Activites', Rapports_Activites);
