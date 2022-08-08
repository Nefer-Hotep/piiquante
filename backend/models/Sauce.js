/* Le model Sauce.js crée un schéma de données pour les sauces */

/* Import et appel */

// Importe le package mongoose de mongoDB dans une constante.
const mongoose = require("mongoose");

// Crée une constante qui utilise la fonction Schema de mongoose
const sauceSchema = mongoose.Schema({
  /* l'identifiant MongoDB unique de l'utilisateur qui a créé la sauce */
  userId: { type: String, required: true },
  /* nom de la sauce */
  name: { type: String, required: true },
  /* fabricant de la sauce */
  manufacturer: { type: String, required: true },
  /* description de la sauce */
  description: { type: String, required: true },
  /* le principal ingrédient épicé de la sauce */
  mainPepper: { type: String, required: true },
  /* l'URL de l'image de la sauce téléchargée par l'utilisateur */
  imageUrl: { type: String, required: true },
  /* nombre entre 1 et 10 décrivant la sauce */
  heat: { type: Number, required: true },
  /* nombre d'utilisateurs qui aiment (= likent) la sauce */
  likes: { type: Number, default: 0},
  /* nombre d'utilisateurs qui n'aiment pas (= dislike) la sauce */
  dislikes: { type: Number, default: 0 },
  /* tableau des identifiants des utilisateurs qui ont aimé (= liked) la sauce */
  usersLiked: { type: [String], default: [] },
  /* tableau des identifiants des utilisateurs qui n'ont pas aimé (= disliked) la sauce */
  usersDisliked: { type: [String], default: [] },
});

// Exporte le schéma en utilisant la méthode .model du package mongoose;
// l'argument 'Sauce' utilise le nom du model et l'option utilise le schéma crée sauceSchema
module.exports = mongoose.model("Sauce", sauceSchema);
