const { response, request } = require('express');
const { 
    buscarUsuarios, 
    buscarProductos, 
    buscarCategorias
} = require('../helpers/busquedas');

// Listas de base de datos que tenemos
const coleccionesPermitidas = [
    'categorias',
    'productos',
    'roles',
    'usuarios',
];


const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json(`Error: Las colecciones permitidas son: ${coleccionesPermitidas}`);
    };

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            return;
        case 'productos':
            buscarProductos(termino, res);
            return;
        case 'categorias':
            buscarCategorias(termino, res);
            return;
        default:
            res.status(500).json({
                msg: `Falta ruta: ${coleccionesPermitidas[2].toUpperCase()} Pronto disponible`
            });

    };


};

module.exports = {
    buscar
}