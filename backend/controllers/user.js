/* Gère la logique des middlewares d'authentification. */

/* Import et appel */
// Import depuis le package.json de bcrypt pour le cryptage des mots de passe.
const bcrypt = require("bcrypt");
// Import depuis le package.json de jsonwebtoken pour la création et la vérification des tokens.
const jwt = require("jsonwebtoken");
// Appel du schéma de données du modèle User.
const User = require("../models/User");

exports.signup = (req, res, next) => {
  // Cryptage(ou hash) asynchrone du mot de passe 10*.
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      // Création d'un user avec le mdp crypté.
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        // Sauvegarde + gestion des status.
        .save()
        .then(() => res.status(201).json({ message: "User created !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  // User.findOne recherche l'utilisateur dans la bdd.
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user === null) {
        // Si il ne trouve pas d'utilisateur erreur 401 + message.
        res
          .status(401)
          .json({ message: "Incorrect username/password" });
      } else {
        // Compare avec bcrypt le mdp reçu avec celui stocké dans la bdd.
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              // Si le mdp est invalide erreur 401 + message.
              res
                .status(401)
                .json({ message: "Incorrect username/password" });
            } else {
              // Si le mdp est valide code 200 + objet avec les infos requis pour l'auth.
              res.status(200).json({
                userId: user._id,
                // Appel la fonction .sign de jwt qui encode le payload du token.
                token: jwt.sign(
                  // Objet userId qui vérifie l'identifiant de l'utilisateur appelé.
                  { userId: user._id },
                  // Clé secrète d'encodage.
                  "RANDOM_TOKEN_SECRET",
                  // Durée d'expiration du token.
                  { expiresIn: "24h" }
                ),
              });
            }
          })
          // Si erreur d'exécution de la requête au serveur code 500.
          .catch((error) => {
            res.status(500).json({ error });
          });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
