const { request, response } = require('express');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const subirArchivo = (
  files,
  extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'],
  carpeta = ''
) => {
  return new Promise((resolve, reject) => {
    if (!files) {
      return reject(`No cargaste ningun archivo`);
    }

    const { archivo } = files;

    const nombreCortado = archivo.name.split('.');

    const ext = nombreCortado[nombreCortado.length - 1];

    if (!extensionesValidas.includes(ext)) {
      return reject(`Las extensiones permitidas son: ${extensionesValidas}`);
    }

    const nombreTemp = uuidv4() + '.' + ext;
    const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);

    archivo.mv(uploadPath, (err) => {
      if (err) {
        reject(err);
      }

      resolve(nombreTemp);
    });
  });
};

module.exports = {
  subirArchivo,
};
