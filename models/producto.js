const {Schema, model} = require('mongoose');

const ProductoSchema = Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true,
    },
    estado : {
        type: Boolean,
        defautl: true,
        required: true
    },
    // Con esta linea se hace referencia al modelo de Usuario de la DB (Mongoose)
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }, 
    precio: {
        type: Number,
        default: 0,
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    descripcion: {
        type: String
    },
    disponible: {
        type: Boolean
    }
    
});

ProductoSchema.methods.toJSON = function () {
    const { __v, estado, ...producto } = this.toObject();
    return producto;
};


module.exports = model('Producto', ProductoSchema);