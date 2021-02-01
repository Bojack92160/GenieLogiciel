var mongoose = require('mongoose');
const UtilisateursSchema = require('./../models/Utilisateurs-model.js');
const ClientsSchema = require('./../models/Clients-model.js');
const ProjetsSchema = require('./../models/Projets-model.js');



module.exports = function(app){

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
}
