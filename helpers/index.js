const dbValidators = require('./db-validators.js');
const generarJWT = require('./generarJWT.js');
const googleVerify = require('./googleVerify.js');
const subirArchivo = require('./subirArchivo.js');

module.exports = {
  ...dbValidators,
  ...generarJWT,
  ...googleVerify,
  ...subirArchivo,
};
