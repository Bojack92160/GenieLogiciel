var mongoose = require('mongoose');

const UtilisateursSchema = require('./../models/Utilisateurs-model.js');
const ClientsSchema = require('./../models/Clients-model.js');
const ProjetsSchema = require('./../models/Projets-model.js');
const NotificationsSchema = require('./../models/Notifications-model.js');
const TachesSchema = require('./../models/Taches-model.js');
const Rapports_Activites = require('./../models/Rapports_Activites-model.js');

var TachesTools = require('./../tools/TachesTools.js');
var NotificationTools = require('./../tools/NotificationTools.js');
require('./../tools/DatePrototypes.js');


module.exports = function(app) {


    /** nécessite l'id de l'utilisateur, nécessite l'id de la tache
     * @_idTache
     * @_idUtilisateur
     */
    app.post('/Action/CommenceTache', async (req, res) => {
        //TODO: vider la liste lors du compte rendu !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        if (!req.body._idTache || !req.body._idUtilisateur) {
          res.json({
            erreur: "Requete non valide. veuillez remplir les champs _idTache et _idUtilisateur",
            success: false
          });
          return;
        }

        let DataTache;
        let DataUtilisateur;
        try {
          DataTache = await TachesSchema.findById(req.body._idTache);
          DataUtilisateur = await UtilisateursSchema.findById(req.body._idUtilisateur);
          if (!DataTache) {
            res.json({erreur: "La tache  " + req.body._idTache + " n'existe pas dans la base de donnée. Veuillez rentrer une id de tache existante", success: false});
            return;
          } else if (!DataUtilisateur) {
            res.json({erreur: "L'utilisateur  " + req.body._idUtilisateur + " n'existe pas dans la base de donnée. Veuillez rentrer un utilisateur existant", success: false});
            return;
          } else {
            if (DataTache.listeSousTaches.length > 0) {
              res.json({erreur: "Impossible de start une activité sur cette tache, elle possède au moin une sous tache (une tache doit etre du plus bas niveau pour pouvoir etre travaillé directement)", success: false});
              return;
            }
            if (DataTache.prédécesseurs.length) {
              for (var i = 0; i < DataTache.prédécesseurs.length; i++) {
                let DataTachePredec = await TachesSchema.findById(DataTache.prédécesseurs[i]);
                if (DataTachePredec && DataTachePredec.dataAvancement.pourcent < 1) {
                  res.json({erreur: "Impossible de travailler sur cette tache, elle possède au moin un prédécesseur qui n'est pas finit (" + DataTachePredec.titre + ")", success: false});
                  return;
                }
              }
            }
          }
          if (DataUtilisateur.email != DataTache.collaborateur) {
            res.json({erreur: "Action impossible! L'utilisateur qui souhaite travailler n'est pas le collaborateur assigné à cette tache.", success: false});
            return;
          }
        } catch (e) {
          console.error(e);
          res.json({erreur: "Une erreur est survenue lors de la recherche de la tache / utilisateur ", stack: e, success: false });
          return;
        }

        //verification que la tache n'est pas deja commencé
        for (var i = 0; i < DataUtilisateur.listeTacheCommences.length; i++) {
          if (DataUtilisateur.listeTacheCommences[i]._id == DataTache._id) {
            res.json({erreur: "Cette tache est deja commencé!", success: false});
            return;
          }
        }


        DataUtilisateur.listeTacheCommences.push({_id: DataTache._id, dateDebut: new Date});
        await DataUtilisateur.save();
        res.json({message: "La tache a bien été commencé!", success: true});
        return;
      });

    }
