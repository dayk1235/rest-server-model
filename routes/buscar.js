const { Router } = require('express');
const { check } = require('express-validator');

const { buscar } = require('../controllers');


const router = Router();


router.get('/:coleccion/:termino', [
    
] ,buscar)


module.exports = router;