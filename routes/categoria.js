const { Router, request, response } = require('express');
const { check } = require('express-validator');

const { 
    obtenerCategorias, 
    obtenerCategoriaId, 
    actualizarCategoria, 
    eliminarCategoria, 
    createCategoria 
} = require('../controllers');


const { existeCategoriaId } = require('../helpers/db-validators');

const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');


// Se crea el router para poder hacer las peticiones
const router = Router();


// Crear categoria - Privado - cualquier persona con token valido --------------------
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es necesario').not().isEmpty(),
    validarCampos
], createCategoria);


//Obtener todas las Categorias - acceso publico --------------------
router.get('/', [

], obtenerCategorias);


//Obtener categoria por ID - acceso publico --------------------
router.get('/:id', [
    check('id', 'No es un ID valido de Mongoo').isMongoId(),
    check('id').custom( existeCategoriaId ),
    validarCampos,
], obtenerCategoriaId);


//Actualizar - privado - cualquier persona con token valido --------------------
router.put('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeCategoriaId), //Revisa si existe en BD
    check('nombre', 'Debes ingresar campos para actualizar').not().isEmpty(),

    validarCampos
], actualizarCategoria);

// Borrar una categoria - debe de ser ADMIN --------------------
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeCategoriaId),
    validarCampos
], eliminarCategoria);

module.exports = router;
