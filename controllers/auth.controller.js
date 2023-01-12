const { response, request } = require('express');
const bcrypt = require('bcryptjs');

const { generarJWT } = require('../helpers/generar.jwt');
const { googleVerify } = require('../helpers/google.verify');

const { Usuario } = require('../models');

//============================================================================

const login = async (req = request, res = response) => {

    const { correo, password } = req.body;

    try {

        //*verificar si el correo existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(404).json({
                msg: 'Usuario || Password incorrectos - correo'
            });
        };

        //*verificar si el usuario esta activo en DB
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario || Password incorrectos - estado: false (fue borrado)'
            });
        };

        //*Verificar la contraseña en DB
        const verificaPassword = bcrypt.compareSync(password, usuario.password);
        if (!verificaPassword) {
            return res.status(404).json({
                msg: 'Usuario || Password incorrectos - contraseña'
            })
        };

        //*Generar JWT
        const token = await generarJWT(usuario.id);


        res.json({
            msg: 'Secion Iniciada Correctamente',
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.json({
            msg: "UPS!!  Algo salio mal - Intenta de Nuevo",
        });
    };

};

const googleSingIn = async (req = request, res = response) => {

    const { id_token } = req.body;


    try {

        const { nombre, img, correo } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            //Crear usuario si no existe
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true,
            };

            //Se crea la instancia de modelo usuario y se guarda
            usuario = new Usuario(data);
            await usuario.save();
        };
        //
        if (!usuario.estado) {
            res.status(401).json({
                msg: 'Usuario bloqueado, hable con el administrador'
            });
        };

        //Se crea token
        const token = await generarJWT(usuario.id);

        //Respuesta
        res.json({
            usuario,
            token
        });

    } catch (error) {
        console.log(error, 'El token no se pudo verificar');
        return res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        });
    };


};

module.exports = {
    login,
    googleSingIn
};