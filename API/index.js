const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const UtilisateursSchema = require('./models/Utilisateurs-model.js');
const ClientsSchema = require('./models/Clients-model.js');

const connectionString = 'mongodb+srv://dbuser:dbuser@projetgl.9eaqw.mongodb.net/ProjetGl?retryWrites=true&w=majority'

const app = express();

app.use(bodyParser.json()) //permet d afficher dans la console les posts data req.body

//routes
app.get('/', (req,res) => {
  res.send("project manager :)")
})

/** Ajout d'un utilisateur
 * requiert un champ :
 * @nom
 * @prenom
 * @mdp
 * @email
 * @role
 * @mdp
 * @tel
 * renvoie un objet avec success a true si reussite, renvoie un objet avec success a false si echec
 */
app.post('/Ajout/Utilisateur', async (req,res) => {
  if (!req.body.nom || !req.body.prenom || !req.body.mdp || !req.body.email || !req.body.role || !req.body.tel) {
    res.json({error: "Requete non valide. veuillez remplir les champs nom, prenom, mdp, email, role et tel", success: false});
    return;
  }
  if (req.body.role!="administrateur" && req.body.role!="responsable de projet" && req.body.role!="collaborateur") {
    res.json({error: "Champ role non valide. il ne peut prendre que les valeurs 'administrateur', 'responsable de projet' ou 'collaborateur' (tout en minuscule!)", success: false});
    return;
  }

  try {
    // On crée une instance du Model
    var NewUtilisateur = new UtilisateursSchema({
      nom: req.body.nom,
      prenom: req.body.prenom,
      mdp: req.body.mdp,
      email: req.body.email,
      role: req.body.role,
      tel: req.body.tel,
      listeProjets: [],
      listeNotifications: [],
      listeTacheCommencés: []
    });

    await NewUtilisateur.save();
    res.json({message: "L'utilisateur a bien été sauvegardé", success: true})

  } catch (e) {
    res.json({error: "Une erreur est survenue", stack: e, success: false})
  }
})

/** Ajout d'un client
 * requiert un champ :
 * @nomEntreprise
 * @tel
 * @email
 * @contactsAssocies
 * renvoie un objet avec success a true si reussite, renvoie un objet avec success a false si echec
 */
app.post('/Ajout/Client', async (req,res) => {
  if (!req.body.nomEntreprise || !req.body.tel || !req.body.email) {
    res.json({error: "Requete non valide. veuillez remplir les champs nomEntreprise, email et tel", success: false});
    return;
  }

  try {
    // On crée une instance du Model
    var NewClient = new ClientsSchema({
      nomEntreprise: req.body.nomEntreprise,
      email: req.body.email,
      tel: req.body.tel,
      contactsAssocies: req.body.contactsAssocies ? req.body.contactsAssocies : [],
    });

    await NewClient.save();
    res.json({message: "Le client a bien été sauvegardé", success: true})

  } catch (e) {
    res.json({error: "Une erreur est survenue", stack: e, success: false})
  }
})



/** Identification
 *  requiert un champ :
 * @email
 * @mdp
 * renvoi les données de l'utilisateurs, sinon un objet avec un champ error et success a false.
 */
app.post('/login', async (req,res) => {
  if (!req.body.email || !req.body.mdp) {
    res.json({error: "Requete non valide. veuillez remplir les champs email et mdp", success: false});
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

  res.json({error: "l'email ou le mot de passe est errone", success: false});
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
