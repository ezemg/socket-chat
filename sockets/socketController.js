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
  socket.emit('recibir-mensajes', chatMensajes.ultimos10);

  // Conectar a sala privada
  socket.join(usuario.id);

  // Limpiar cuando alguien se desconecta
  socket.on('disconnect', () => {
    chatMensajes.desconectarUsuario(usuario.id);
    io.emit('usuarios-activos', chatMensajes.usuariosArr);
  });

  socket.on('enviar-mensaje', ({ uid, mensaje }) => {
    if (uid) {
      socket.to(uid).emit('mensaje-privado', {
        de: usuario.nombre,
        mensaje,
      });
    } else {
      chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje);
      io.emit('recibir-mensajes', chatMensajes.ultimos10);
    }
  });
};

module.exports = { socketController };
