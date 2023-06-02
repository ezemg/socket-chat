const { Socket } = require('socket.io');
const { comprobarJWT } = require('../helpers/index.js');
const { ChatMensajes } = require('../models');

const chatMensajes = new ChatMensajes();

// Quitar el New Socket cuando pasamos a producción
socketController = async (socket = new Socket(), io) => {
  const token = socket.handshake.headers['x-token'];

  const usuario = await comprobarJWT(token);
  if (!usuario) {
    return socket.disconnect();
  }
  // Agregar el usuario conectado
  chatMensajes.conectarUsuario(usuario);
  io.emit('usuarios-activos', chatMensajes.usuariosArr);

  // Limpiar cuando alguien se desconecta
  socket.on('disconnect', () => {
    chatMensajes.desconectarUsuario(usuario.id);
    io.emit('usuarios-activos', chatMensajes.usuariosArr);
  });
};

module.exports = { socketController };
