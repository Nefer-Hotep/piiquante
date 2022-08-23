/* Vérifie les informations d'authentification envoyée par le client */

// Import depuis le package.json de jsonwebtoken pour la création et la vérification des tokens.
const jwt = require("jsonwebtoken");

// Export de la fonction middleware.
module.exports = (req, res, next) => {
  // Récupère le token et le vérifie.
  try {
    // Divise le Bearer et récupère uniquement le token dans une constante.
    const token = req.headers.authorization.split(" ")[1];
    // Décode le token et le vérifie
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    // Récupère l'userId du token.
    const userId = decodedToken.userId;

    // Ajoute la valeur userId à l'objet de requête et la redirige vers les routes appelées plus tard.
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    // Récupère l'erreur avec un statut 401 + erreur.
    res.status(401).json({ error }); 
  }
};
