/* sauces.js créer une routes pour les sauces de l'application. */

/* Import et appel */

// Import d'express dans une constante depuis le package.json.
const express = require("express");
// Crée un router en utilisant la methode .Router() d'express.
const router = express.Router();
// Import du middleware de gestion d'autorisation.
const auth = require("../middleware/auth");
// Import de la gestion des fichiers images avec les configurations de multer.
const multer = require("../middleware/multer-config");
// Appel le controller pour associer les fonction aux différentes routes
const saucesCtrl = require("../controllers/sauces");

/* Gestion des routes */

// CRUD
// Create Read Update Delete

// Create
router.post("/", auth, multer, saucesCtrl.createSauce);
router.post("/:id/like", auth, saucesCtrl.likeSauce);
// Read (One)
router.get("/:id", auth, saucesCtrl.getOneSauce);
// Update
router.put("/:id", auth, multer, saucesCtrl.modifySauce);
// Delete
router.delete("/:id", auth, saucesCtrl.deleteSauce);
// Read (all)
router.get("/", auth, saucesCtrl.getAllSauces);

// Exporte le router pour être accessible par les autres fichiers
module.exports = router;
