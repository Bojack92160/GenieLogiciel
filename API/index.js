var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var UtilisateursSchema = require('./models/Utilisateurs-model.js');
var ClientsSchema = require('./models/Clients-model.js');
var ProjetsSchema = require('./models/Projets-model.js');
var NotificationsSchema = require('./models/Notifications-model.js');

const connectionString = 'mongodb+srv://dbuser:dbuser@projetgl.9eaqw.mongodb.net/ProjetGl?retryWrites=true&w=majority'

const app = express();

app.use(bodyParser.json()) //permet d afficher dans la console les posts data req.body

require('./path/Search.js')(app);
require('./path/Add.js')(app);
require('./path/Delete.js')(app);

//routes
app.get('/', (req,res) => {
  res.send("project manager :)")
})

//TODO
/*
  Lorsqu on add Rapport, update les DATES DE CETTE TACHE

*/


/** Identification
 *  requiert un champ :
 * @email
 * @mdp
 * renvoi les données de l'utilisateurs, sinon un objet avec un champ erreur et success a false.
 */
app.post('/login', async (req,res) => {
  if (!req.body.email || !req.body.mdp) {
    res.json({erreur: "Requete non valide. veuillez remplir les champs email et mdp", success: false});
    return;
  }
  //recherche des utilisateurs avec cet email
  let Utilisateur = await UtilisateursSchema.findOne({"email":req.body.email, "mdp":req.body.mdp});
  if (!Utilisateur) {
    res.json({erreur: "email ou mot de pass errone", success: false});
    return;
  }

  let Response = {dataUtilisateur: {}, dataProjects:[], dataNotifications:[], success: true}
  Response.dataUtilisateur = Utilisateur;

  for (var i = 0; i < Utilisateur.listeProjets.length; i++) {
    await Response.dataProjects.push(await ProjetsSchema.findById(Utilisateur.listeProjets[i]))
  }

  for (var i = 0; i < Utilisateur.listeNotifications.length; i++) {
    await Response.dataNotifications.push(await NotificationsSchema.findById(Utilisateur.listeNotifications[i]))
  }

  res.json(Response);
})


//connect to mongodb
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.log("connected to DB!");
})

app.listen(3000);
