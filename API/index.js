const MongoClient = require('mongodb').MongoClient;
const UtilisateursSchema = require('./models/Utilisateurs-model.js');
const express = require('express');

const connectionString = 'mongodb+srv://dbuser:dbuser@projetgl.9eaqw.mongodb.net/ProjetGl?retryWrites=true&w=majority'

const app = express();

app.use(bodyParser.json()) // permet d afficher dans la console les posts data req.body

//routes
app.get('/', (req,res) => {
  res.send("sweet home")
})

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

app.listen(3000);
