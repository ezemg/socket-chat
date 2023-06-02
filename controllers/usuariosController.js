const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario.js');
const { validationResult } = require('express-validator');

const usuariosGet = async (req = request, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { estado: true };

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query).skip(+from).limit(+limit),
  ]);

  res.json({
    total,
    usuarios,
  });
};

const usuariosPut = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;

  if (password) {
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto, {
    returnDocument: 'after',
  });

  res.json(usuario);
};

const usuariosPost = async (req, res = response) => {
  try {
  } catch (error) {}

  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });

  // Encriptar password

  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);

  // Guardar en la DB
  await usuario.save();

  res.status(201).json({
    msg: 'post API - controlador',
    usuario,
  });
};
const usuariosPatch = (req, res = response) => {
  res.status(201).json({
    msg: 'post PATCH - controlador',
  });
};
const usuariosDelete = async (req, res = response) => {
  const { id } = req.params;

  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

  res.json({ usuario });
};

module.exports = {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosPatch,
  usuariosDelete,
};
