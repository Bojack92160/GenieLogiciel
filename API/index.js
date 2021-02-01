const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const UtilisateursSchema = require('./models/Utilisateurs-model.js');
const ClientsSchema = require('./models/Clients-model.js');
const ProjetsSchema = require('./models/Projets-model.js');

const connectionString = 'mongodb+srv://dbuser:dbuser@projetgl.9eaqw.mongodb.net/ProjetGl?retryWrites=true&w=majority'

const app = express();

app.use(bodyParser.json()) //permet d afficher dans la console les posts data req.body

//routes
app.get('/', (req,res) => {
  res.send("project manager :)")
})

/** Recherche par Id Pure. Va rechercher dans toute les collections existantes
 *  requiert un champ :
 * @id
 * Renvoi l'objet en question si trouvé, renvoi un objet avec un champ erreur sinon
 */
app.post('/Recherche/Id', async (req,res) => {
  if (!req.body.id) {
    res.json({erreur: "Requete non valide. veuillez remplir lechamp id", success: false});
    return;
  }

  try {
      new mongoose.Types.ObjectId(req.body.id)
  } catch (e) {
    res.json({erreur: "Impossible de caster le champ id en ObjectId. assurez vous qu'il sagit bien d'un id (exemple d'id: '5d273f9ed58f5e7093b549b0')", success: false});
    return;
  }

  try {
      let Response = await UtilisateursSchema.findById(req.body.id);
      if (Response) {
        res.json(Response);
        return;
      }
      Response = await ClientsSchema.findById(req.body.id);
      if (Response) {
        res.json(Response);
        return;
      }
      Response = await ProjetsSchema.findById(req.body.id);
      if (Response) {
        res.json(Response);
        return;
      }

      //TODO: RAJOUTER LES AUTRES COLLECTIONS
      res.json({erreur: "Aucun element ne correspond a cet id ("+req.body.id+")", success: false})
  } catch (e) {
    res.json({erreur: "Une erreur est survenue", stack: e, success: false})
  }


})







/** Ajout d'un Projet
 * requiert un champ :
 * @titre
 * @responsable
 * @description
 * @dateDebutInit
 * @dateFinInit
 * @client
 * !il faut que le client existe, sinon erreur
 * !il faut que le responsable existe dans Utilisateur et qu'il ne soit pas collaborateur, sinon erreur
 * les champs listeProjets du client et du responsable sont automatiquement MAJ
 * renvoie un objet avec success a true si reussite, renvoie un objet avec success a false si echec
 */
app.post('/Ajout/Projet', async (req,res) => {
  if (!req.body.titre || !req.body.responsable || !req.body.description || !req.body.dateDebutInit || !req.body.dateFinInit || !req.body.client) {
    res.json({erreur: "Requete non valide. veuillez remplir les champs titre, responsable, mdp, description, dateDebutInit, dateFinInit et client", success: false});
    return;
  }

  //On verifie que le client existe bien
  let DataClient;
  try {
    DataClient = await ClientsSchema.findOne({email: req.body.client});
    if (!DataClient) {
      res.json({erreur: "Le client "+req.body.client+" n'existe pas dans la base de donnée. Veuillez rentrer un client existant, ou creer un client avec ce mail", success: false});
      return;
    }
  } catch (e) {
    console.error(e);
    res.json({erreur: "Une erreur est survenue lors de la recherche du client", stack: e, success: false});
    return;
  }

  //On verifie que le responsable existe bien et bon role
  let DataResponsable;
  try {
    DataResponsable = await UtilisateursSchema.findOne({email: req.body.responsable});
    if (!DataResponsable) {
      res.json({erreur: "Le responsable "+req.body.responsable+" n'existe pas dans la base de donnée. Veuillez rentrer un client existant, ou creer un client avec ce mail", success: false});
      return;
    }
    if (DataResponsable.role == "collaborateur") {
      res.json({erreur: "Le responsable "+req.body.responsable+" n'a pas le droit d'être responsable de projet", success: false});
      return;
    }
  } catch (e) {
    console.error(e);
    res.json({erreur: "Une erreur est survenue lors de la recherche du responsable", stack: e, success: false});
    return;
  }

  //on convertit bien en Date
  try {
    req.body.dateDebutInit = new Date(req.body.dateDebutInit);
    req.body.dateFinInit = new Date(req.body.dateFinInit);
  } catch (e) {
    console.error(e);
    res.json({erreur: "Probleme lors du parsage des dates dateDebutInit et dateFinInit", stack: e, success: false});
    return;
  }

  try {
    //on créé l'id manuellement pour le sauvegardé
    let ID = mongoose.Types.ObjectId();
    // On crée une instance du Model
    var NewProjet = new ProjetsSchema({
      _id: ID,
      titre: req.body.titre,
      responsable: req.body.responsable,
      description: req.body.description,
      dateDebutInit: req.body.dateDebutInit,
      dateFinInit: req.body.dateFinInit,
      dateDebutEffect: req.body.dateDebutInit,
      dateFinEffect: req.body.dateFinInit,
      listeSousTaches: [],
      dataAvancement: {
        pourcent: 0, //entre 0 et 1
        chargeConsommé: 0, //Somme des soustaches
        chargeRestante: 0, //Somme des soustaches
        chargeInitiale: 0, //Somme des soustaches
        chargeEffective: 0, //Somme des soustaches
      },
      client: req.body.client,
    });
    await NewProjet.save();
    DataResponsable.listeProjets.push(ID);
    DataClient.listeProjets.push(ID);
    await DataResponsable.save()
    await DataClient.save()

    res.json({message: "Le projet a bien été sauvegardé", success: true});
  } catch (e) {
    console.error(e);
    res.json({erreur: "Une erreur est survenue", stack: e, success: false});
  }
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
    res.json({erreur: "Requete non valide. veuillez remplir les champs nom, prenom, mdp, email, role et tel", success: false});
    return;
  }
  if (req.body.role!="administrateur" && req.body.role!="responsable de projet" && req.body.role!="collaborateur") {
    res.json({erreur: "Champ role non valide. il ne peut prendre que les valeurs 'administrateur', 'responsable de projet' ou 'collaborateur' (tout en minuscule!)", success: false});
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
    res.json({erreur: "Une erreur est survenue", stack: e, success: false})
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
    res.json({erreur: "Requete non valide. veuillez remplir les champs nomEntreprise, email et tel", success: false});
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
    res.json({erreur: "Une erreur est survenue", stack: e, success: false})
  }
})



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
  let ListUtilisateurs = await UtilisateursSchema.find({"email":req.body.email});
  if (ListUtilisateurs.length == 0) {
    res.json({erreur: "adresse email introuvable"});
  }

  for (var i = 0; i < ListUtilisateurs.length; i++) {
    if (ListUtilisateurs[i].mdp == req.body.mdp) {
      res.json(ListUtilisateurs[i]);
      return;
    }
  }

  res.json({erreur: "l'email ou le mot de passe est errone", success: false});
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
