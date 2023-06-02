const { response, request } = require('express');

const { Usuario, Categoria } = require('../models/index.js');

const obtenerCategorias = async (req = request, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { estado: true };

  const [total, categorias] = await Promise.all([
    Categoria.countDocuments(query),
    Categoria.find(query)
      .skip(+from)
      .limit(+limit)
      .populate('usuario', 'nombre'),
  ]);

  res.json({
    total,
    categorias,
  });
};

const obtenerCategoria = async (req = request, res = response) => {
  const { id } = req.params;
  const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

  res.json(categoria);
};

const crearCategoria = async (req = request, res = response) => {
  const nombre = req.body.nombre.toUpperCase();

  try {
    const categoriaDB = await Categoria.findOne({ nombre });
    if (categoriaDB) {
      return res.status(400).json({
        msg: `La categoria ${categoriaDB.nombre}, ya existe`,
      });
    }

    //   Generar la data a guardar

    const data = {
      nombre,
      usuario: req.usuario._id,
    };

    const categoria = new Categoria(data);

    await categoria.save();

    res.json({ categoria });
  } catch (error) {
    res.send({ error });
  }
};

const actualizarCategoria = async (req = request, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  data.nombre = data.nombre.toUpperCase();
  data.usuario = req.usuario._id.valueOf();

  console.log({ data });
  try {
    const categoria = await Categoria.findByIdAndUpdate(id, data, {
      new: true,
    });

    res.json(categoria);
    //   Generar la data a guardar
  } catch (error) {
    console.log(error);
  }
};

const eliminarCategoria = async (req = request, res = response) => {
  const { id } = req.params;

  const categoria = await Categoria.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );

  res.json(categoria);
};

module.exports = {
  obtenerCategorias,
  obtenerCategoria,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
};
