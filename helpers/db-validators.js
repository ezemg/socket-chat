const mongoose = require('mongoose');

const Role = require('../models/role.js');
const { Usuario, Categoria, Producto } = require('../models');

const esRoleValido = async (rol = '') => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`el rol ${rol} no esta registrado en la DB`);
  }
};

const emailExiste = async (correo = '') => {
  const existeEmail = await Usuario.findOne({ correo });
  if (existeEmail) {
    throw new Error(`el correo: ${correo} ya se encuentra registrado en la DB`);
  }
};

const existeUsuarioPorId = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`No es un id valido`);
  }

  const usuarioExiste = await Usuario.findById(id);

  if (!usuarioExiste) {
    throw new Error(`No existe id: ${id}`);
  }
};

const existeCategoriaPorId = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`No es un id valido`);
  }

  const categoriaExiste = await Categoria.findById(id);

  if (!categoriaExiste) {
    throw new Error(`No existe categoria con id: ${id}`);
  }
};

const existeProductoPorId = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`No es un id valido`);
  }
  const productoExiste = await Producto.findById(id);

  if (!productoExiste) {
    throw new Error(`No existe producto con id: ${id}`);
  }
};

const isMongoId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
  if (!colecciones.includes(coleccion)) {
    throw new Error(
      `La coleccion ${coleccion} no es permitida. Las colecciones permitidas son ${colecciones}`
    );
  }

  return true;
};

module.exports = {
  esRoleValido,
  emailExiste,
  existeUsuarioPorId,
  existeCategoriaPorId,
  existeProductoPorId,
  isMongoId,
  coleccionesPermitidas,
};
