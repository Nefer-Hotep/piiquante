/* Gère les routes d'authentification */

/* Import et appel */
// Importe express dans une constante depuis le package.json.
const express = require("express");
// Appel le controller pour associer les fonctions aux différentes routes
const userCtrl = require("../controllers/user");

// Crée un router en utilisant la méthode .Router() d'express.
const router = express.Router();

// Crée la route post /signup avec les fonctions du controller et la méthode .signup.
router.post("/signup", userCtrl.signup);
// Crée la route post /login avec les fonctions du controller et la méthode .login.
router.post("/login", userCtrl.login);

// Exporte le router pour être accessible par les autres fichiers.
module.exports = router;
