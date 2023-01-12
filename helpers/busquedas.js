const { ObjectId } = require('mongoose').Types;
const { response, request } = require('express')

const { Usuario, Producto, Categoria } = require('../models');


const buscarUsuarios = async (termino = '', res = response) => {


    const esMongoId = ObjectId.isValid(termino);   // Esta funcion regresa TRUE || FALSE true si es un id de mongoose

    if (esMongoId) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        });
    };

    const regex = new RegExp(termino, 'i');

    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    })

    res.json({
        results: usuarios
    })

};

const buscarProductos = async (termino = '', res = response) => {

    const isMongoId = ObjectId.isValid(termino);

    if (isMongoId) {
        const producto = await Producto.findById(termino)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre');

        return res.json({
            results: (producto) ? [producto] : []
        });
    };

    const regex = new RegExp(termino, 'i'); //Para que no busque como sea que este escrito

    const productos = await Producto.find({ nombre: regex })
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');

    res.json({
        results: productos
    });

};

const buscarCategorias = async (termino = '', res = response) => {

    const isMongoId = ObjectId.isValid(termino);

    if (isMongoId) {
        const categoria = await Categoria.findById(termino)
            .populate('usuario', 'nombre');

        return res.json({
            resutls: (categoria) ? [categoria] : []
        });
    };

    const regex = new RegExp(termino, 'i');

    const categorias = await Categoria.find({
        $or: [{ nombre: regex }],
        $and: [{ estado: true }]
    }).populate('usuario', 'nombre');

    res.json({
        resutls: categorias
    });
};

module.exports = {
    buscarUsuarios,
    buscarProductos,
    buscarCategorias
};
