const MongoClient = require('mongodb').MongoClient;
const UtilisateursSchema = require('./models/Utilisateurs-model.js');

const connectionString = 'mongodb+srv://dbuser:dbuser@projetgl.9eaqw.mongodb.net/ProjetGl?retryWrites=true&w=majority'

MongoClient.connect(connectionString, function(err, client) {
   if(err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
        return 0;
   }
   console.log('Connected...');
   const collection = client.db("ProjetGl").collection("ProjetGl");
   // perform actions on the collection object
   client.close();
});
