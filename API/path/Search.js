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

  /** Recherche pour taches.
   *  Champs possibles :
   * @id //retourne une liste d'1 seul element max
   * @titre
   * @responsable
   * @collaborateur
   * @date //retourne les projets dont cette date est inclus entre dateDebutInit et dateFinInit
   * Renvoi un liste (potentielle vide)
   */
  app.post("/Recherche/Tache", async (req, res) => {
    if (!req.body.id && !req.body.titre && !req.body.responsable && !req.body.client && !req.body.date && !req.body.collaborateur) {
      res.json(await TachesSchema.find());
      return;
    }
    let ResponseList = [];
    if (req.body.id) {
      let Response = await TachesSchema.findById(req.body.id);
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
      res.json(await TachesSchema.find({"titre" : {$regex : ".*"+req.body.titre+".*"}}));
      return;
    } else if (req.body.responsable) {
      res.json(await TachesSchema.find({"responsable" : req.body.responsable}));
      return;
    } else if (req.body.collaborateur) {
      res.json(await TachesSchema.find({"collaborateur" : req.body.collaborateur}));
      return;
    } else if (req.body.client) {
      res.json(await TachesSchema.find({"client" : req.body.client}));
      return;
    } else if (req.body.date) {
      ResponseList = await TachesSchema.find();
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

  /** Recherche pour utilisateur.
   *  Champs possibles :
   * @id //retourne une liste d'1 seul element max
   * @nom
   * @prenom
   * @email
   * Renvoi un liste (potentielle vide)
   */
  app.post("/Recherche/Utilisateur", async (req, res) => {
    if (!req.body.id && !req.body.nom && !req.body.prenom && !req.body.email) {
      res.json(await UtilisateursSchema.find());
      return;
    }
    let ResponseList = [];
    if (req.body.id) {
      let Response = await UtilisateursSchema.findById(req.body.id);
      if (Response) {
        ResponseList.push(Response);
        res.json(ResponseList);
        return;
      } else {
        res.json([]);
        return;
      }
    }

    if (req.body.nom) {
      res.json(await UtilisateursSchema.find({"nom" : {$regex : ".*"+req.body.nom+".*"}}));
      return;
    } else if (req.body.prenom) {
      res.json(await UtilisateursSchema.find({"prenom" : {$regex : ".*"+req.body.prenom+".*"}}));
      return;
    } else if (req.body.email) {
      res.json(await UtilisateursSchema.find({"email" : req.body.email}));
      return;
    }

    res.json([]);
    return;

  });

  /** Recherche pour utilisateur.
   *  Champs possibles :
   * @id //retourne une liste d'1 seul element max
   * @nomEntreprise
   * @email
   * Renvoi un liste (potentielle vide)
   */
  app.post("/Recherche/Client", async (req, res) => {
    if (!req.body.id && !req.body.nomEntreprise && !req.body.email) {
      res.json(await ClientsSchema.find());
      return;
    }
    let ResponseList = [];
    if (req.body.id) {
      let Response = await ClientsSchema.findById(req.body.id);
      if (Response) {
        ResponseList.push(Response);
        res.json(ResponseList);
        return;
      } else {
        res.json([]);
        return;
      }
    }

    if (req.body.nomEntreprise) {
      res.json(await ClientsSchema.find({"nomEntreprise" : {$regex : ".*"+req.body.nomEntreprise+".*"}}));
      return;
    } else if (req.body.email) {
      res.json(await ClientsSchema.find({"email" : req.body.email}));
      return;
    }

    res.json([]);
    return;

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
