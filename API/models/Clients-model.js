const mongoose = require('mongoose');

const Clients = mongoose.Schema({
  nomEntreprise: String,
  tel: Number,
  email: String,
  contactsAssocies: [String],
  listeProjets: [String]
});

module.exports = mongoose.model('Clients', Clients);
