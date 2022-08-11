/* Middleware de configuration de multer qui permet de gérer les fichiers entrant et sortant */

/* Import et appel */
// Import de multer depuis le package.json.
const multer = require("multer");

/* Création d'un objet de configuration de multer. */

// Crée un dictionnaire pour les extension de fichier.
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
  // Indique quel nom de fichier utilisé.
  filename: (req, file, callback) => {
    // Génère le nouveau nom pour le fichier en remplaçant 
    // les espaces par des _ (empèche certaines erreurs serveur).
    let name = file.originalname.split(" ").join("_");
    name = name.substring(0, name.lastIndexOf("."));

    // Applique une extension aux fichiers utilisant le dictionnaire crée.
    const extension = MIME_TYPES[file.mimetype];
    // Appel le callback avec le nom, la date et .extension (ex: mon_image050820221245.jpg).
    callback(null, name + Date.now() + "." + extension);
  },
});

// Exporte le middleware multer configuré avec les paramètres de storage dans un fichier unique d'image.
module.exports = multer({ storage }).single("image");
