const { response, request } = require('express');

const { Producto } = require('../models');


// Crear Producto ----------------------------------------------------------------
const crearProducto = async (req = request, res = response) => {

    const { estado, usuario, ...datos } = req.body;


    //Se tiene que buscar en mayusculas ya que asi
    // se guardo en la DB (se tiene que buscar igual que en DB)
    const productoDB = await Producto.findOne({ nombre: datos.nombre.toUpperCase() });

    if (productoDB) {
        return res.status(401).json({
            error: `El producto: ${productoDB.nombre} ya existe en la DB`
        });
    };

    //Se genera la info que se va a guardar en la DB 
    const data = {
        ...datos,
        nombre: datos.nombre.toUpperCase(),
        usuario: req.usuario._id,
        estado: req.usuario.estado

    };

    //Se crea 
    const resultado = new Producto(data);


    await resultado.save();


    res.status(201).json({
        done: 'Producto agregado correctamente',
        resultado
    });
};


// Obtener Productos --------------------------------------------------------------
const obtenerProductos = async (req, res = response,) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    try {

        const numRegistros = await Producto.countDocuments(query);

        const producto = await Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))


        res.json({
            done: '..::Productos::..',
            numRegistros,
            producto

        });

    } catch (error) {
        console.error(error);
        return res.status(401).json('Algo salio mal al consultar intente de nuevo');
    };




};


// Obtener Producto por ID ----------------------------------------------------------------
const obtenerProductoPorId = async (req, res = response) => {

    const { id } = req.params;

    try {

        const producto = await Producto.findById(id)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')

        res.status(201).json({
            done: 'Producto',
            producto
        })

    } catch (error) {
        console.error(error);
        return res.status(401).json('Algo salio mal al consultar intente de nuevo')
    };


};


// Actualizar Producto ----------------------------------------------------------------
const actualizarProducto = async (req, res = response) => {
    const id = req.params.id
    const { estado, usuario, categoria, ...data } = req.body;

    const nombre = data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id //Se asigna el ID del usuario para poder usarlo en este controlador

    try {

        const producto = await Producto.findOne({ nombre })
       

        if (producto) {
            return res.status(401).json({
                msg: `El producto: ${producto.nombre} ya existe intente de nuevo`
            })
        };

        const productoaUpdate = await Producto.findByIdAndUpdate(id, data, { new: true })
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')


        res.status(201).json({
            done: 'Produco Actualizado Correctamente',
            productoaUpdate
        })


    } catch (error) {
        console.error(error);
        return res.status(401).json('Algo salio mal al actualizar intente de nuevo')
    };


};


// Eliminar Producto ----------------------------------------------------------------
const eliminarProducto = async (req, res = response) => {

    const { id } = req.params;

    const productoEliminar = await Producto.findByIdAndUpdate(id, { estado: false })
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')


    res.status(201).json({
        done: 'Producto Eliminado',
        productoEliminar
    });
};



module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto

};