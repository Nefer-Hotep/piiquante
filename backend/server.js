/* Créer un server NodeJS */

// Importe le package http de NodeJS.
const http = require("http");
// Appel dotenv pour avoir accès aux variables d'environnement.
require("dotenv").config()
// Importe l'application Express dans une constante app.
const app = require("./app");

// La fonction normalizePort renvoie un port valide,
// qu'il soit fourni sous la forme d'un numéro ou d'une chaine de caractère.
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || "3000");

// Indique sur quel port l'app doit s'exécuter.
app.set("port", port);

// La fonction errorHandler recherche les différentes erreurs et les gère de manière appropriée.
// Elle est ensuite enregistrée dans le serveur.  
const errorHandler = error => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges.');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use.');
        process.exit(1);
        break;
      default:
        throw error;
    }
  };

// Créer un serveur avec l'objet http et avec un argument
// app est appellé à chaque requête reçue par le serveur.
const server = http.createServer(app);

// Un écouteur d'évènements est ajouté.
// Consignant le port ou le canal nommé sur lequel le serveur s'exécute dans la console.
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

// Écoute les requêtes envoyées au serveur sur le port.
server.listen(port);
