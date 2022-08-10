/* Middleware de configuration de multer qui permet de gérer les fichers entrant et sortant */

/* Import et appel */
// Import de multer depuis le package.json.
const multer = require("multer");

/* Création d'un objet de configuration de multer. */

// Crée un dictionaire pour les extension de fichier.
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// .diskStorage indique qu'on souhaite l'enregistrer sur le disk.
const storage = multer.diskStorage({
  // défini la destination du fichier.
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  // indique quel nom de fichier utilisé.
  filename: (req, file, callback) => {
    // génère le nouveau nom pour le fichier en remplacant les espaces par des _ (empèche certaine erreur serveur).
    const name = file.originalname.slice(0, 4).split(" ").join("_");
    // applique une extansion aux fichiers utilisant le dictionaire crée.
    const extension = MIME_TYPES[file.mimetype];
    // appel le callback avec le nom, la date et .extansion (ex: mon_image050820221245.jpg).
    callback(null, name + Date.now() + "." + extension);
  },
});

// Exporte le middleware multer configuré avec les paramètres de storage dans un fichier unique d'image.
module.exports = multer({ storage }).single("image");
