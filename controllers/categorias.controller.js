const { response, request } = require('express');
const { Categoria } = require('../models');

// Crear categoria --------------------
const createCategoria = async (req = request, res = response) => {

    // Aqui aparte de extraer el nombre se convierte a mayusculas
    const nombre = req.body.nombre.toUpperCase();


    try {

        const categoriaDB = await Categoria.findOne({ nombre });

        //Si la categoria ya existe en DB  
        if (categoriaDB) {
            return res.status(400).json({
                msg: `La categoria ${categoriaDB.nombre} ya existe en la DB`
            });
        };

        // Generar los datos a Guardar
        const data = {
            nombre,
            usuario: req.usuario._id, // Se guarda el id de la DB que viene del modelo del usuario
            estado: req.usuario.estado
        };

        // Se inserta la data en el modelo de categoria
        const categoria = new Categoria(data);

        // Se guarda en DB 
        await categoria.save();


        res.status(201).json({
            msg: `Se registro ${nombre} con exito en BD`,
            categoria
        });

    } catch (error) {
        console.error(error);
        res.status(401).json({
            ok: false,
            msg: `No se pudo registrar ${nombre} intentelo de nuevo`
        });
    };



};

// Obtener todas las categorias --------------------
const obtenerCategorias = async (req = request, res = response) => {

    // Esto viene de los params de postman
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    try {
        // Esta linea es para crear el contador de cuantos registros hay en DB
        const numRegistros = await Categoria.countDocuments(query);

        const registros = await Categoria.find(query)
            .populate('usuario', 'nombre') // Muestra el usuario que registro la busqueda
            .skip(Number(desde))
            .limit(Number(limite));


        res.status(201).json({
            msg: 'Todo ok desde - GET',
            numRegistros,
            registros

        });
    } catch (error) {
        console.error(error);
        res.status(401).json({
            ok: false,
            msg: 'Algo salio mal al consultar intente de nuevo'
        })
    };


};

// Obtener categorias por ID --------------------
const obtenerCategoriaId = async (req = request, res = response) => { 

    const id = req.params.id;

    try {

        const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

        res.status(201).json({
            msg: 'Busqueda Exitosa',
            categoria
        });

    } catch (error) {
        console.error(error);
        res.status(401).json({
            ok: false,
            error: 'No se pudo realizar la busqueda del producto'
        })
    };

};

// Actualizar categoria -------------------- 
const actualizarCategoria = async (req = request, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body; // Se quita el estado

    const nombre = data.nombre = data.nombre.toUpperCase(); //Convierte el nombre en Mayusculas
    data.usuario = req.usuario._id;

    try {
        const categoria = await Categoria.findOne({ nombre });

        if (categoria) {
            return res.status(400).json(`La categoria: ${categoria.nombre} ya existe en (BD) intente de nuevo`);
        };

        const categoriaUpdate = await Categoria.findByIdAndUpdate(id, data, { new: true }).populate('usuario', 'nombre'); //Actualiza

        res.status(201).json({
            msg: 'Actualizacion Correcta',
            categoriaUpdate
        });

    } catch (error) {
        console.error(error);
        return res.status(400).json({
            error: 'Ups algo salio mal intenta de nuevo'
        });
    };

};

// Eliminar categoria --------------------
const eliminarCategoria = async (req = request, res = response) => {

    const { id } = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false }).populate('usuario', 'nombre');

    res.status(201).json({
        done: 'Registro eliminado de la BASE DE DATOS',
        categoria
    });
};


module.exports = {
    obtenerCategorias,
    obtenerCategoriaId,
    createCategoria,
    actualizarCategoria,
    eliminarCategoria
};
