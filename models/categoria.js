const {Schema, model} = require('mongoose');

const CategoriaSchema = Schema({

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
    }
    
});

CategoriaSchema.methods.toJSON = function () {
    const { __v, estado, ...categoria } = this.toObject();
    return categoria;
};


module.exports = model('Categoria', CategoriaSchema);