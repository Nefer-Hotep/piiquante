/* Gère la logique des middlewares de CRUD. */

// Import du model qu'on as crée qui utilise mongoose.
const Sauce = require("../models/Sauce"); 

// CRUD
// Create Read Update Delete

// Create

// Read (One)

// Update

// Delete

// Read (all)
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

/* A FAIRE !! */
// https://openclassrooms.com/fr/courses/6390246-passez-au-full-stack-avec-node-js-express-et-mongodb/6466669-modifiez-les-routes-pour-prendre-en-compte-les-fichiers#/id/r-7905559
