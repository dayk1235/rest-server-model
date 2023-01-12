const path = require('path');
const { v4: uuidv4 } = require('uuid');


const subirArchivo = (files, extencionesPermitidas = ['gif', 'png', 'jpg', 'jpeg'], carpeta = '') => {

    return new Promise((resolve, reject) => {

        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extencion = nombreCortado[nombreCortado.length - 1].toLowerCase();

        if (!extencionesPermitidas.includes(extencion)) {
            reject(`Las extencion ${extencion.toUpperCase()} no esta permitida ${extencionesPermitidas}`);
        };

        const nombreFinal = uuidv4() + '.' + extencion;

        const uploadPath = path.join(__dirname, '../uploads', carpeta, nombreFinal);


        archivo.mv(uploadPath, (err) => {
            if (err) {
                console.log(err);
                return reject(err);
            };
        });

        resolve(nombreFinal);

    });


};


module.exports = subirArchivo;

