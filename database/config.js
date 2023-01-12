const mongoose = require('mongoose');
require('colors');

const connectionDB = async () => {

    try {
        await mongoose.connect( process.env.MONGODB_CNN );

        console.log('Conexion a DataBase ONLINE'.green);
        
    } catch (error) { 
        console.log(error);  
        throw new Error('Error en la conexion de la base de datos')
    };

};


module.exports = {
    connectionDB
}