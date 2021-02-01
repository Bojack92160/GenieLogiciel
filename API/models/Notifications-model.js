const mongoose = require('mongoose');

const Notifications = mongoose.Schema({
  de: String,
  pour: String,
  _idde: String,
  _idpour: String,
  date: {
      type: Date,
      default: Date.now
    },
  contenu: String
});

module.exports = mongoose.model('Notifications', Notifications);
