const path = require('path');
const fs = require('fs');

const { response, request } = require('express');

const { subirArchivo } = require('../helpers');

const { Usuario, Producto } = require('../models/index.js');

const cargarArchivo = async (req, res = response) => {
  try {
    const nombre = await subirArchivo(req.files, undefined, 'imgs');

    res.json({ nombre });
  } catch (error) {
    res.json({ msg: error });
  }
};

const actualizarArchivo = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({ msg: `No existe usuario con id ${id}` });
      }
      break;
    case 'productos':
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({ msg: `No existe producto con id ${id}` });
      }
      break;

    default:
      return res
        .status(500)
        .json({ msg: 'Se me olvidó validar esta colección' });
  }

  // Limpiar imagenes previas
  if (modelo.img) {
    // Borrar

    const pathImagen = path.join(
      __dirname,
      '../uploads',
      coleccion,
      modelo.img
    );

    fs.existsSync(pathImagen) && fs.unlinkSync(pathImagen);
  }

  const nombre = await subirArchivo(req.files, undefined, coleccion);
  modelo.img = nombre;

  await modelo.save();

  res.json(modelo);
};

const mostrarImagen = async (req = request, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({ msg: `No existe usuario con id ${id}` });
      }
      break;
    case 'productos':
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({ msg: `No existe producto con id ${id}` });
      }
      break;

    default:
      return res
        .status(500)
        .json({ msg: 'Se me olvidó validar esta colección' });
  }

  // Limpiar imagenes previas
  if (modelo.img) {
    const pathImagen = path.join(
      __dirname,
      '../uploads',
      coleccion,
      modelo.img
    );

    if (fs.existsSync(pathImagen)) {
      return res.sendFile(pathImagen);
    }
  }

  const noImage = path.join(__dirname, '../assets', 'no-image.jpg');

  res.sendFile(noImage);
};

module.exports = {
  cargarArchivo,
  actualizarArchivo,
  mostrarImagen,
};
