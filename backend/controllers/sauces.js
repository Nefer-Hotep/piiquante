/* Gère la logique des middlewares de CRUD. */

// Import du model qu'on as crée qui utilise mongoose.
const Sauce = require("../models/Sauce");

// CRUD
// Create Read Update Delete

// Create
exports.createSauce = (req, res, next) => {
  // Parse l'objet requête (json => chaine de caractère).
  console.log(req.body.sauce);
  const sauceObjet = JSON.parse(req.body.sauce);
  // Supprime dans l'objet le champ ._id car il va être généré par la bdd.
  delete sauceObjet._id;
  // Supprime dans l'objet le champ .userId car il a été créer par l'utilisateur(non sécurisé).
  delete sauceObjet._userId;
  
  //
  const sauce = new Sauce({
    ...sauceObjet.body,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
  });

  sauce
    .save()
    .then(() => res.status(201).json({ message: "Objet enregisté !" }))
    .catch((error) => res.status(400).json({ error }));
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
}
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
