const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario.js');

const { generarJWT } = require('../helpers/generarJWT.js');
const { googleVerify } = require('../helpers/googleVerify.js');

const login = async (req, res = response) => {
  const { correo, password } = req.body;

  try {
    // Verificar si el email existe
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - correo',
      });
    }

    // Verificar si el usuario esta activo en DB
    if (!usuario.estado) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - estado: false',
      });
    }

    // Verificar password
    const validPassowrd = bcryptjs.compareSync(password, usuario.password);
    if (!validPassowrd) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - password',
      });
    }

    const token = await generarJWT(usuario.id);

    // Generar el JWT
    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: 'Hable con el admin',
    });
  }
};

const googleSignIn = async (req, res) => {
  const { id_token } = req.body;

  try {
    const { nombre, img, correo } = await googleVerify(id_token);
    let usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      const data = {
        nombre,
        correo,
        password: ':P',
        img,
        google: true,
      };
      usuario = new Usuario(data);

      await usuario.save();
    }

    // Si el usuario en DB tiene estado en false
    if (!usuario.estado) {
      return res.status(401).json({
        msg: 'Hablar con admin, usuario bloqueado',
      });
    }

    // Generar JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: 'El token no se pudo verificar',
    });
  }
};

const renovarToken = async (req = request, res = response) => {
  const { usuario } = req;

  const token = await generarJWT(usuario.id);

  res.json({ usuario, token });
};

module.exports = {
  login,
  googleSignIn,
  renovarToken,
};
