const { response, request } = require('express');

const { Producto } = require('../models/index.js');

const obtenerProductos = async (req = request, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { estado: true };

  const [total, productos] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query)
      .skip(+from)
      .limit(+limit)
      .populate('usuario', 'nombre')
      .populate('categoria', 'nombre'),
  ]);

  res.json({
    total,
    productos,
  });
};

const obtenerProducto = async (req = request, res = response) => {
  const { id } = req.params;
  const producto = await Producto.findById(id)
    .populate('usuario', 'nombre')
    .populate('categoria', 'nombre');

  res.status(200).json(producto);
};

const crearProducto = async (req = request, res = response) => {
  try {
    const { estado, usuario, ...body } = req.body;

    const productoDB = await Producto.findOne({ nombre: body.nombre });

    if (productoDB) {
      return res.status(400).json({
        msg: `El producto ${productoDB.nombre}, ya existe`,
      });
    }

    const data = {
      ...body,
      nombre: body.nombre.toUpperCase(),
      usuario: req.usuario._id,
    };

    const producto = new Producto(data);

    await producto.save();

    res.status(201).json({
      producto,
    });
  } catch (error) {
    res.send(error.message);
  }
};

const actualizarProducto = async (req = request, res = response) => {
  const { id } = req.params;

  const update = {};
  for (const key of Object.keys(req.body)) {
    if (req.body[key] !== '') {
      update[key] = req.body[key];
    }
  }
  update.usuario = req.usuario._id;
  update.nombre = update.nombre.toUpperCase();

  try {
    const producto = await Producto.findByIdAndUpdate(
      id,
      { $set: update },
      {
        new: true,
      }
    );

    res.status(200).json(producto);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const eliminarProducto = async (req = request, res = response) => {
  const { id } = req.params;

  const producto = await Producto.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );
  res.json(producto);
};

module.exports = {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
};
