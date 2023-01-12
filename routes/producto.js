const { Router } = require('express');
const { check } = require('express-validator');

const { 
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
} = require('../controllers');


const { existeCategoriaId, existeProductoId } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');


const router = Router(); // Se inicializa el Router que es la ruta


// Crear Producto ------------------
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es necesario').not().isEmpty(),
    check('categoria', 'No es un ID de Mongoo').isMongoId(),
    check('categoria').custom(existeCategoriaId),
    validarCampos
], crearProducto);


//Obtener todos los productos - acceso publico --------------------
router.get('/', [

], obtenerProductos);


//Obtener producto por ID - acceso publico --------------------
router.get('/:id', [
    check('id', 'No es un ID valido de Mongoo').isMongoId(),
    check('id').custom(existeProductoId),
    validarCampos
], obtenerProductoPorId);


//Actualizar producto - privado - cualquier persona con token valido --------------------
router.put('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID valido de Mongoo').isMongoId(),
    check('id').custom(existeProductoId),
    check('categoria').optional().custom(existeCategoriaId),
    check('nombre', "Debes de ingresar campos para actualizar").not().isEmpty(),
    validarCampos
], actualizarProducto);


// Borrar una categoria - debe de ser ADMIN --------------------
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID valido de Mongoo').isMongoId(),
    check('id').custom(existeProductoId),
    
    validarCampos
], eliminarProducto);



module.exports = router;
