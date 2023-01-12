require('dotenv').config(); //Para leer la variables de entorno del .env
const { Server } = require('./models');

const server = new Server();

server.listen();