/* Gère les routes d'authentification */

/* Import et appel */
// Importe express dans une constante depuis le package.json.
const express = require("express");
// Appel le controller pour associer les fonction aux différentes routes
const userCtrl = require("../controllers/user");

// Crée un router en utilisant la methode .Router() d'express.
const router = express.Router();

// Crée la route post /signup avec les fonction du controller et la methode .signup
router.post("/signup", userCtrl.signup);
// Crée la route post /login avec les fonction du controller et la methode .login
router.post("/login", userCtrl.login);

// Exporte le router pour être accessible par les autres fichiers
module.exports = router;
