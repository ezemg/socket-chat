const { Router } = require('express');
const { buscar } = require('../controllers/searchController.js');

const router = Router();

router.get('/:coleccion/:termino', buscar);

module.exports = router;
