const { response, request } = require('express'); //autocompletado de la response y request

const bcrypt = require('bcryptjs'); // Hasear Password

const { Usuario } = require('../models'); // Modelo de usuario


//Crea
const usuarioPost = async (req = request, res = response) => {

    //Se toman los datos de la req y despues se crea el Usuario
    const { nombre, correo, password, rol, telefono } = req.body;

    // Se crea el usuario
    const usuario = new Usuario({ nombre, correo, password, rol, telefono });

    //---Hasear la contraseña---
    const salt = bcrypt.genSaltSync(10);
    usuario.password = bcrypt.hashSync(password, salt);

    //---Guardar en DB ---
    await usuario.save();

    //Imprimir en consola el resultado
    res.json({ done: "¡¡Usuario registrado con exito!!", usuario });
};

//Consigue Datos
const usuarioGet = async (req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true } // condicion para mostar o no mostrar los registros en countDocuments


    try {
        const usuariosCount = await Usuario.countDocuments(query);

        const usuarios = await Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))

        res.json({
            msg: 'Usuarios en Sistema',
            usuariosCount,
            usuarios
        });

    } catch (error) {
        console.error(error);
        return res.status(501).json('Ago salio mal al realizar la busqueda contacte al ADMIN')
    };

};

//Actualiza
const usuarioPut = async (req = request, res = response) => {

    const { id } = req.params;

    const { _id, password, google, correo, ...resto } = req.body;

    if (password) {
        const salt = bcrypt.genSaltSync(10);
        resto.password = bcrypt.hashSync(password, salt);
    };

    const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true });

    res.status(200).json({
        done: 'Usuario Actualizado',
        usuario
    });

};

//Elimina
const usuarioDelete = async (req = request, res = response) => {

    const { id } = req.params;
    const estado = { estado: false }

    //Para eliminar permanentemente de DB 
    //const usuario = await Usuario.findByIdAndDelete(id);


    //*Solo cambia el estado del registro para no eliminar de DB
    const usuario = await Usuario.findByIdAndUpdate(id, estado);


    res.json({
        done: 'Registro eliminado de la BASE DE DATOS',
        usuario,
    });
};

//Dirección
const usuarioPatch = (req = request, res = response) => {
    res.json({
        msg: 'patch API - controlador'
    });
};


module.exports = {
    usuarioGet,
    usuarioPut,
    usuarioPost,
    usuarioDelete,
    usuarioPatch
};