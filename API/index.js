const MongoClient = require('mongodb').MongoClient;
const UtilisateursSchema = require('./models/Utilisateurs-model.js');

const connectionString = 'mongodb+srv://Bojack:Bojack@projetgl.9eaqw.mongodb.net/<dbname>?retryWrites=true&w=majority'

MongoClient.connect(connectionString, function(err, client) {
   if(err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
   }
   console.log('Connected...');
   const collection = client.db("ProjetGL").collection("ProjetGL");
   // perform actions on the collection object
   client.close();
   // okdakor
});
