/* Gère la logique des middlewares de CRUD. */

/* Import et appel */

// Import du model qu'on as crée qui utilise mongoose.
const Sauce = require("../models/Sauce");
// Import de fs (file system) pour avoir accès aux modifications de fichier sur le système.
const fs = require("fs");

// CRUD
// Create Read Update Delete

// Create
exports.createSauce = (req, res, next) => {
  // Parse l'objet requête (json => chaine de caractère).
  const sauceObject = JSON.parse(req.body.sauce);
  // Supprime dans l'objet le champ ._id car il va être généré par la bdd.
  delete sauceObject._id;
  // Supprime dans l'objet le champ .userId car il a été créer par l'utilisateur(non sécurisé).
  delete sauceObject._userId;

  // Création d'un nouvel objet sauce avec la décompsition de sauceObject, le nouvel userId authentifié et le chemin de l'image.
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregisté !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.likeSauce = (req, res, next) => {
  // On cherche l'objet dans la bdd et vérifie la provenance de la requête.
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const userId = req.body.userId;
      const userLikes = req.body.like;
      // Evalue l'expression userLikes et exécute les instructions correspondantes.
      switch (userLikes) {
        // Le cas 1 ajoute un like
        case 1:
          // Vérifie si un like existe déjà dans l'objet.userliked. Si il ne trouve rien incrémente un like.
          if (!sauce.usersLiked.includes(userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { likes: +1 },
                $push: { usersLiked: userId },
              }
            )
              .then(() => {
                res.status(201).json({ message: "Like added !" });
              })
              .catch((error) => res.status(400).JSON({ error }));
          }
          break;
        // Le cas 0 retourne le like ou le dislike à 0
        case 0:
          // Si un like est présent dans l'objet.userLiked retire le like.
          if (sauce.usersLiked.includes(userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { likes: -1 },
                $pull: { usersLiked: userId },
              }
            )
              .then(() => {
                res.status(201).json({ message: "Like removed !" });
              })
              .catch((error) => res.status(400).JSON({ error }));
          }
          // Si un dislike est présent dans l'objet.userLiked retire le dislike.
          else if (sauce.usersDisliked.includes(userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { dislikes: -1 },
                $pull: { usersDisliked: userId },
              }
            )
              .then(() => {
                res.status(201).json({ message: "Dislike removed !" });
              })
              .catch((error) => res.status(400).JSON({ error }));
          }
          break;
        // Le cas -1 ajoute un dislike.
        case -1:
          // Vérifie si un dislike existe déjà dans l'objet.userDisliked. Si il ne trouve rien incrémente un dislike.
          if (!sauce.usersDisliked.includes(userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { dislikes: +1 },
                $push: { usersDisliked: userId },
              }
            )
              .then(() => {
                res.status(201).json({ message: "Dislike added !" });
              })
              .catch((error) => res.status(400).JSON({ error }));
          }
          break;
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// Read (One)
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

// Update
exports.modifySauce = (req, res, next) => {
  // Si un fichier est présent ou pas le format de la requête ne sera pas le même.
  // Ici on vérifie si un fichier est présent ou non.
  const sauceObject = req.file
    ? // Si il y a un champ file, on doit récupéré l'objet et parse la chaine de caractère.
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : // S'il n'y a pas d'objet transmis on le récupère dans le body de la requête.
      {
        ...req.body,
      };
  // On supprime l'_useId de la requête pour éviter les modifications d'objets par d'autre utilisateurs.
  delete sauceObject._userId;
  // On cherche l'objet dans la bdd et vérifie la provenance de la requête.
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // Si la requête provient d'un utilisateur non-autorisé un message est transmis.
      if (sauce.userId != req.auth.userId) {
        res.status(403).json({ message: "403: unauthorized request." });
      }
      // Si la requête est valide on met à jour la modification.
      else {
        Sauce.updateOne(
          // Indique ou effectuer la modification et avec quel objet.
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Sauce modified !" }))
          .catch((error) => {
            res.status(401).json({ error });
          });
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// Delete
exports.deleteSauce = (req, res, next) => {
  // Vérifie l'utilisateur qui supprime l'objet.
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // Si la requête provient d'un utilisateur non-autorisé un message est transmis.
      if (sauce.userId != req.auth.userId) {
        res.status(403).json({ message: "403: unauthorized request." });
      } else {
        // Si la requête est valide on supprime l'objet avec son image.

        //
        const filename = sauce.imageUrl.split("/images/")[1];
        // Appel de la méthode .unlink de fs
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Sauce deleted !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

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
