const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarArchivo } = require('../middlewares');

const {
  cargarArchivo,
  actualizarArchivo,
  mostrarImagen,
} = require('../controllers/uploadController.js');

const {
  isMongoId,
  coleccionesPermitidas,
} = require('../helpers/db-validators.js');

const router = Router();

router.get(
  '/:coleccion/:id',
  [
    check('id', 'Debe ser id de mongo').isMongoId(),
    check('coleccion').custom((c) =>
      coleccionesPermitidas(c, ['usuarios', 'productos'])
    ),
    validarCampos,
  ],
  mostrarImagen
);

router.post('/', validarArchivo, cargarArchivo);
router.put(
  '/:coleccion/:id',
  [
    validarArchivo,
    check('id', 'Debe ser id de mongo').isMongoId(),
    check('coleccion').custom((c) =>
      coleccionesPermitidas(c, ['usuarios', 'productos'])
    ),
    validarCampos,
  ],
  actualizarArchivo
);

module.exports = router;
