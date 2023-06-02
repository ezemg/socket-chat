// Dependencias
const { Router } = require('express');
const { check } = require('express-validator');

// Middlewares =
const {
  validarCampos,
  validarJWT,
  tieneRole,
  esAdminRole,
} = require('../middlewares');

// Helpers
const {
  esRoleValido,
  emailExiste,
  existeUsuarioPorId,
} = require('../helpers/db-validators.js');

// Controlador
const {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
  usuariosPatch,
} = require('../controllers/usuariosController.js');

const router = Router();

router.get('/', usuariosGet);

router.put(
  '/:id',
  [
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRoleValido),
    validarCampos,
  ],
  usuariosPut
);

router.post(
  '/',
  [
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(emailExiste),

    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio y mas de 6 caracteres')
      .isLength({ min: 6 })
      .not()
      .isEmpty(),
    // check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom(esRoleValido),
    validarCampos,
  ],
  usuariosPost
);

router.patch('/', usuariosPatch);

router.delete(
  '/:id',
  [
    validarJWT,
    esAdminRole,
    // tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id').custom(existeUsuarioPorId),
    validarCampos,
  ],
  usuariosDelete
);

module.exports = router;
