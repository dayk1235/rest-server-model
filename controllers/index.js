const categorias = require('./categorias.controller');
const producto = require('./producto.controller');
const usuarios = require('./usuarios.controller');
const auth = require('./auth.controller');
const buscar = require('./buscar.controller');
const uploads = require('./uploads.controller');


module.exports = {
    ...categorias,
    ...producto,
    ...usuarios,
    ...auth,
    ...buscar,
    ...uploads
};