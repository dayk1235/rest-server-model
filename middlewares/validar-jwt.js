const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const { Usuario } = require('../models');

const validarJWT = async (req = request, res = response, next) => {

        // Se define como se va a pedir el token
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        });
    };

    try {
        
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        //Leer el usuario que corresponde al uid de la base de datos
        const usuario = await Usuario.findById(uid);

        if (!usuario) {
            return res.status(401).json({
                msg: 'Usuario no existe en DB'
            });
        };

        //Usuario debe estar activo en DataBase
        if (!usuario.estado) {
            return res.status(401).json({
                done: 'No se puede eliminar - Estado: False'
            })
        };

        req.usuario = usuario; //Se guarda en el modelo del usuario
        // req.uid = uid; //*Este es el Usuario (id) que esta borrando el usuario

        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        });
    };

};


module.exports = {
    validarJWT
};