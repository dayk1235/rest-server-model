const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload')


const { connectionDB } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        //*Direcciones
        this.paths = {
            auth:        '/api/auth',
            buscar:      '/api/buscar',
            categorias:  '/api/categorias',
            productos:   '/api/productos',
            usuarios:    '/api/usuarios',
            uploads:     '/api/uploads'
        };

        //*Conexion a DataBase
        this.conectarDB();

        //*middleware
        this.middleware();

        //*Rutas del servidor
        this.routes();
    };

    async conectarDB() {

        await connectionDB();

    };

    middleware() {
        //Cors
        this.app.use(cors());

        //lectura y parseo de peticion post del body
        this.app.use(express.json());

        //Directorio publico
        this.app.use(express.static('public'));

        //Para poder recibir archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true,
        }));

    };

    routes() {

        this.app.use(this.paths.auth, require('../routes/auth')); //!             Autenticacion Path 
        this.app.use(this.paths.buscar, require('../routes/buscar')); //!         Buscar Path
        this.app.use(this.paths.categorias, require('../routes/categoria')); //!  Cagetoria Path
        this.app.use(this.paths.productos, require('../routes/producto')); //!    Producto Path
        this.app.use(this.paths.usuarios, require('../routes/usuarios')); //!     Usuario Path 
        this.app.use(this.paths.uploads, require('../routes/uploads')); //!      Uploads Path 
    };

    listen() {

        this.app.listen(this.port, () => console.log('Sirviendo servidor en el puerto'.red, this.port.green));

    };


};

module.exports = Server;