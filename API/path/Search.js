var mongoose = require("mongoose");
const UtilisateursSchema = require('./../models/Utilisateurs-model.js');
const ClientsSchema = require('./../models/Clients-model.js');
const ProjetsSchema = require('./../models/Projets-model.js');
const NotificationsSchema = require('./../models/Notifications-model.js');
const TachesSchema = require('./../models/Taches-model.js');

module.exports = function (app) {

  /** Recherche pour projet.
   *  Champs possibles :
   * @id //retourne une liste d'1 seul element max
   * @titre
   * @responsable
   * @date //retourne les projets dont cette date est inclus entre dateDebutInit et dateFinInit
   * Renvoi un liste (potentielle vide)
   */
  app.post("/Recherche/Projet", async (req, res) => {
    if (!req.body.id && !req.body.titre && !req.body.responsable && !req.body.client && !req.body.date) {
      res.json(await ProjetsSchema.find());
      return;
    }
    let ResponseList = [];
    if (req.body.id) {
      let Response = await ProjetsSchema.findById(req.body.id);
      if (Response) {
        ResponseList.push(Response);
        res.json(ResponseList);
        return;
      } else {
        res.json([]);
        return;
      }
    }

    if (req.body.titre) {
      res.json(await ProjetsSchema.find({"titre" : {$regex : ".*"+req.body.titre+".*"}}));
      return;
    } else if (req.body.responsable) {
      res.json(await ProjetsSchema.find({"responsable" : req.body.responsable}));
      return;
    } else if (req.body.client) {
      res.json(await ProjetsSchema.find({"client" : req.body.client}));
      return;
    } else if (req.body.date) {
      ResponseList = await ProjetsSchema.find();
      let FiltredResponseList = [];
      try {
        for (var i = 0; i < ResponseList.length; i++) {
          let DateDebut = new Date(ResponseList[i].dateDebutInit);
          let DateFin = new Date(ResponseList[i].dateFinInit);
          let MyDate = new Date(req.body.date);
          if (MyDate>=DateDebut && MyDate<=DateFin) {
            FiltredResponseList.push(ResponseList[i]);
          }
        }
        res.json(FiltredResponseList);
        return;
      } catch (e) {
        res.json([]);
        return;
      }

    }


  });


  /** Recherche par Id Pure. Va rechercher dans toute les collections existantes
   *  requiert un champ :
   * @id
   * Renvoi l'objet en question si trouvé, renvoi xun objet avec un champ erreur sinon
   */
  app.post("/Recherche/Id", async (req, res) => {
    if (!req.body.id) {
      res.json({
        erreur: "Requete non valide. veuillez remplir lechamp id",
        success: false,
      });
      return;
    }

    try {
      new mongoose.Types.ObjectId(req.body.id);
    } catch (e) {
      res.json({
        erreur:
          "Impossible de caster le champ id en ObjectId. assurez vous qu'il sagit bien d'un id (exemple d'id: '5d273f9ed58f5e7093b549b0')",
        success: false,
      });
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
      Response = await NotificationsSchema.findById(req.body.id);
      if (Response) {
        res.json(Response);
        return;
      }
      Response = await TachesSchema.findById(req.body.id);
      if (Response) {
        res.json(Response);
        return;
      }
      //TODO: RAJOUTER LES AUTRES COLLECTIONS
      res.json({
        erreur: "Aucun element ne correspond a cet id (" + req.body.id + ")",
        success: false,
      });
    } catch (e) {
      res.json({ erreur: "Une erreur est survenue", stack: e, success: false });
    }
  });
};
