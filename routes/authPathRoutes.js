const { Router } = require('express');
const { check } = require('express-validator');

const {
  login,
  googleSignIn,
  renovarToken,
} = require('../controllers/authController.js');
const { validarCampos, validarJWT } = require('../middlewares');

const router = Router();

router.post(
  '/login',
  [
    check('correo', 'el correo es obligatorio').isEmail(),
    check('password', 'password es obligatorio').notEmpty(),
    validarCampos,
  ],
  login
);
router.post(
  '/google',
  [check('id_token', 'id_token es necesario').notEmpty(), validarCampos],
  googleSignIn
);

router.get('/', validarJWT, renovarToken);

module.exports = router;
