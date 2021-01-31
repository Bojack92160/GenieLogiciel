const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const UtilisateursSchema = require('./models/Utilisateurs-model.js');


const connectionString = 'mongodb+srv://dbuser:dbuser@projetgl.9eaqw.mongodb.net/ProjetGl?retryWrites=true&w=majority'

const app = express();

app.use(bodyParser.json()) //permet d afficher dans la console les posts data req.body

//routes
app.get('/', (req,res) => {
  res.send("sweet home")
})





/** Identification
 *  requiert un champ :
 * @email
 * @mdp
 * renvoi les données de l'utilisateurs, sinon un champ error.
 */
app.post('/login', async (req,res) => {
  if (!req.body.email || !req.body.mdp) {
    res.json({error: "Requete non valide. veuillez remplir les champs email et mdp"});
    return;
  }
  //recherche des utilisateurs avec cet email
  let ListUtilisateurs = await UtilisateursSchema.find({"email":req.body.email});
  if (ListUtilisateurs.length == 0) {
    res.json({error: "adresse email introuvable"});
  }

  for (var i = 0; i < ListUtilisateurs.length; i++) {
    if (ListUtilisateurs[i].mdp == req.body.mdp) {
      res.json(ListUtilisateurs[i]);
      return;
    }
  }

  res.json({error: "l'email ou le mot de passe est errone"});
})


//connect to mongodb
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.log("connected to DB!");
})

/*
// On crée une instance du Model
var AdminUtilisateur = new UtilisateursSchema({
  nom: "Admin",
  prenom: "Admin",
  mdp: "Admin",
  email: "Admin@gmail.com",
  role: "Administrateur",
  tel: "0683145939",
  listeProjets: [],
  listeNotifications: [],
  listeTacheCommencés: []
});

// On le sauvegarde dans MongoDB !
AdminUtilisateur.save(function (err) {
  if (err) { throw err; }
  console.log('utilisateur ajouté avec succès !');
  // On se déconnecte de MongoDB maintenant
  mongoose.connection.close();
});*/

app.listen(3000);
