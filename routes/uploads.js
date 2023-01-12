const { Router } = require('express')
const { check } = require('express-validator');

const { cargaArchivos, actualizarArchivoImg, mostarArchivoImg, actualizarArchivoImgCloud } = require('../controllers');
const { coleccionesPermitidas } = require('../helpers/db-validators');
const { validarCampos, validarArchivo, validarJWT } = require('../middlewares');




const router = Router();


router.post('/', [
    validarJWT
], cargaArchivos);

router.put('/:coleccion/:id', [
    validarJWT,
    validarArchivo,
    check('id', 'No es un ID valido de Mongoo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos', 'categorias'])),
    validarCampos
], actualizarArchivoImgCloud);

router.get('/:coleccion/:id', [
    check('id', 'No es un ID valido de Mongoo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos', 'categorias'])),
    validarCampos
], mostarArchivoImg);





module.exports = router;