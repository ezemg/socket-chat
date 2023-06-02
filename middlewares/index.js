// Middlewares
const validarCampos = require('../middlewares/validarCampos.js');
const validarJWT = require('../middlewares/validarJWT.js');
const validaRoles = require('../middlewares/validarRol.js');
const validarArchivo = require('../middlewares/validarArchivo.js');

module.exports = {
  ...validarCampos,
  ...validarJWT,
  ...validaRoles,
  ...validarArchivo,
};
