/* Créer une application express */

/* Import et appel */

// Importe express dans une constante depuis le package.json.
const express = require("express");
// Importe depuis le package.json mongoose de mongoDB dans une constante.
const mongoose = require("mongoose");

/* Appel des router */
// Importe le router de sauces.js
const saucesRoutes = require("./routes/sauces");
// Importe le router de user.js
const userRoutes = require("./routes/user");
// ????
const path = require('path');

// Indique à app d'utiliser express.
const app = express();

// Ouvre mongoDB avec mongoose et gestion des Promises
mongoose
  .connect(
    "mongodb+srv://NeferHotep:Bubbletea187M@cluster0.8xpgh.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

/* Création des Middlewares */
// Définie les headers (en-têtes) pour les autorisations CORS.
app.use((req, res, next) => {
  // Donne le contrôle a tout le monde.
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Autorise certains en-tête.
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  // Autorise certaines methode CRUD.
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  //next() renvoie la réponse.
  next();
});

// Parse les requêtes entrantes en json.
app.use(express.json());

// Racine des routes de CRUD
app.use("/api/sauces", saucesRoutes);
// Racine des routes d'authentification
app.use("/api/auth", userRoutes);
// Route de gestion des fichiers statique
app.use('/images', express.static(path.join(__dirname, 'images')))

// Export app pour y accéder depuis les autres fichiers.
module.exports = app;
