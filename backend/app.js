/* Créer une application express */

/* Import et appel */

// Importe express dans une constante depuis le package.json.
const express = require("express");
// Importe helmet dans une constante depuis le package.json
const helmet = require("helmet");
// Importe depuis le package.json mongoose de mongoDB dans une constante.
const mongoose = require("mongoose");

/* Appel des router */
// Importe le router de sauces.js
const saucesRoutes = require("./routes/sauces");
// Importe le router de user.js
const userRoutes = require("./routes/user");
// Appel le module "path" de node. Il fournit des utilitaires pour travailler avec 
// les chemins de fichiers et de répertoires. 
const path = require("path");

// Indique à app d'utiliser express.
const app = express();

// Définie des headers HTTP sécurisé en utilisant le package helmet.
// Ajoute aussi une option d'autorisation d'accès des images global.
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); 

// Créer une constante avec la variable d'environemment API_KEY
const api_key = process.env.API_KEY;

// Ouvre mongoDB avec mongoose et gestion des Promises
mongoose
  .connect(
    `mongodb+srv://${api_key}@cluster0.8xpgh.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Successful connection to MongoDB"))
  .catch(() => console.log("Connection to MongoDB failed"));

/* Création des Middlewares */
// Définie les headers (en-têtes) pour les autorisations CORS. ??????
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
  // next() renvoie la réponse.
  next();
});

// Parse les requêtes entrantes en json.
app.use(express.json());

// Racine des routes de CRUD
app.use("/api/sauces", saucesRoutes);
// Racine des routes d'authentification
app.use("/api/auth", userRoutes);
// Route de gestion des fichiers statique
app.use("/images", express.static(path.join(__dirname, "images")));

// Export app pour y accéder depuis les autres fichiers.
module.exports = app;
