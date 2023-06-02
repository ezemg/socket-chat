// Dependencias
const { Router } = require('express');
const { check } = require('express-validator');

// Middlewares

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');
const { existeCategoriaPorId } = require('../helpers/db-validators.js');

// Controllers
const {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  eliminarCategoria,
} = require('../controllers/categoriasController.js');

const router = Router();

router.get('/', obtenerCategorias);

// Obtener una categoria - publico
router.get(
  '/:id',
  [check('id').custom(existeCategoriaPorId), validarCampos],
  obtenerCategoria
);

// Crear nueva categoria - Privado - cualquier rol con token valido
router.post(
  '/',
  [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    validarCampos,
  ],
  crearCategoria
);

// Modificar o actualizar categoria - privado - cualquiera con token valido
router.put(
  '/:id',
  [
    validarJWT,
    check('id').custom(existeCategoriaPorId),
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    validarCampos,
  ],
  actualizarCategoria
);

// Elimimnar categoria - privado - solo ADMIN
router.delete(
  '/:id',
  [
    validarJWT,
    esAdminRole,
    check('id').custom(existeCategoriaPorId),
    validarCampos,
  ],
  eliminarCategoria
);

module.exports = router;
