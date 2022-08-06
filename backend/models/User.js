/* Le model User.js crée un schéma de données pour les utilisateurs */

/* Appel des packages */

// Importe depuis package.json mongoose de mongoDB dans une constante.
const mongoose = require("mongoose");
// Importe depuis package.json mongoose-unique-validator pour avoir une validation avant sauvegarde de l'email indiqué.
const uniqueValidator = require('mongoose-unique-validator')

/* Le schema */

// Crée une constante qui utilise la fonction Schema de mongoose
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Applique l'email validator avec la fonction .plugin avant de faire le model du schema
userSchema.plugin(uniqueValidator)

// Exporte le schéma en utilisant la méthode .model du package mongoose;
// l'argument 'user' utilise le nom du model et l'option utilise le schéma crée userSchema
module.exports = mongoose.model("User", userSchema);