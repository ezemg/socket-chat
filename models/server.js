const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { createServer } = require('http');

const { dbConnection } = require('../database/config.js');
const { socketController } = require('../sockets/socketController.js');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    // Socket.Io
    this.server = createServer(this.app);
    this.io = require('socket.io')(this.server);

    this.paths = {
      auth: '/api/auth',
      buscar: '/api/buscar',
      categorias: '/api/categorias',
      productos: '/api/productos',
      usuarios: '/api/usuarios',
      uploads: '/api/uploads',
    };

    // Conectar a DB
    this.conectarDB();

    // Middlewares
    this.middlewares();

    // Rutas
    this.routes();

    // Sockets
    this.sockets();
  }

  async conectarDB() {
    await dbConnection();
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // Lectura y parseo del body
    this.app.use(express.json());

    // Directorio public
    this.app.use(express.static('public'));

    // Carga de archivos
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp/',
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use(this.paths.auth, require('../routes/authPathRoutes.js'));
    this.app.use(this.paths.buscar, require('../routes/searchRoutes.js'));
    this.app.use(this.paths.usuarios, require('../routes/usuariosRoutes.js'));
    this.app.use(this.paths.uploads, require('../routes/uploadRoutes.js'));

    this.app.use(
      this.paths.categorias,
      require('../routes/categoriasRoutes.js')
    );

    this.app.use(this.paths.productos, require('../routes/productosRoutes.js'));
  }

  sockets() {
    this.io.on('connection', (socket) => socketController(socket, this.io));
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log('Servidor corriendo en puerto', this.port);
    });
  }
}

module.exports = Server;
