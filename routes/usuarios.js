//!Express
const { Router } = require('express');
const { check } = require('express-validator');

//!Controladores
const {
    usuarioGet, 
    usuarioPut, 
    usuarioPost, 
    usuarioDelete, 
    usuarioPatch
} = require('../controllers');

//!Helpers y middelwares
const {
    validarCampos, 
    validarJWT, 
    tieneRole
} = require('../middlewares');

//! Validicaiones de DB
const { roleValidator, existeEmail, existeUsuarioId, existeTelefono } = require('../helpers/db-validators');

//!Instancia router 
const router = Router();

//* El primer argumento es el path (direccion), 2-middelwares, 3.el controlador
//!Get -------------------- Obtiene un Usuario
router.get('/', usuarioGet);

//!Put -------------------- Actualiza un Usuario
router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioId),
    check('rol').custom(roleValidator),
    validarCampos,
], usuarioPut);

//!Post -------------------- Crea un Usuario
router.post('/', [
    check('nombre', 'Nombre Obligatorio!!').not().isEmpty(),
    check('password', 'Password Obligatorio!! debe de ser de mas de 6 caracteres').isLength({ min: 6 }),
    check('correo', 'El correo no es valido!!').isEmail(),
    check('telefono', 'Debe de contener minimo 10 caracteres').isLength({min: 10, max: 10}),
    check('correo',).custom(existeEmail),
    check('rol').custom(roleValidator),
    // check('rol', 'Rol no valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    validarCampos
], usuarioPost);

//!Delete -------------------- Elimina un Usuario
router.delete('/:id', [
    validarJWT,
    // esAdminRole,  //Para recibir solo un role ser mas exigentes
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'), //Para ser mas flexibles permitir varios roles
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioId),
    validarCampos
], usuarioDelete);

//!Patch ---------------------
router.patch('/', usuarioPatch);


module.exports = router;