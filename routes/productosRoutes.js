const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');

const {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} = require('../controllers/productosController.js');

const {
  existeProductoPorId,
  existeCategoriaPorId,
} = require('../helpers/db-validators.js');

const router = Router();

module.exports = router;

router.get('/', obtenerProductos);

router.get(
  '/:id',
  [check('id').custom(existeProductoPorId), validarCampos],
  obtenerProducto
);
router.post(
  '/',
  [
    validarJWT,
    check('categoria').custom(existeCategoriaPorId),
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    validarCampos,
  ],
  crearProducto
);
router.put(
  '/:id',
  [validarJWT, check('id').custom(existeProductoPorId), validarCampos],
  actualizarProducto
);
router.delete(
  '/:id',
  [
    validarJWT,
    esAdminRole,
    check('id').custom(existeProductoPorId),
    validarCampos,
  ],
  eliminarProducto
);
