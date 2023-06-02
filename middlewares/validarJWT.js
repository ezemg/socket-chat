const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario.js');

const validarJWT = async (req = request, res = response, next) => {
  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      msg: 'No hay token en la peticion',
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      return res.status(401).json({
        msg: 'Token no valido - No existe usuario en DB',
      });
    }

    if (!usuario.estado) {
      // Verificar si el UID pertenece a estado true
      return res.status(401).json({
        msg: 'Token no valido - Usuario con estado: false',
      });
    }

    req.usuario = usuario;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: 'Token no valido',
    });
  }
};

module.exports = {
  validarJWT,
};
