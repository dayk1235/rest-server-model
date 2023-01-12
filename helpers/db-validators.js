
const { Usuario, Categoria, Producto, Role } = require('../models')


const roleValidator = async (rol = '') => {
    const existeRol = await Role.findOne({ rol })
    if (!existeRol) {
        throw new Error(`El rol: ${rol} no esta registrado en la DB`);
    };
};

const existeEmail = async (correo = '') => {
    const validaEmail = await Usuario.findOne({ correo });
    if (validaEmail) {
        throw new Error(`El correo: ${correo} ya esta registrado en DB`)
    };
};
const existeUsuarioId = async (id = '') => {
    const validaPorId = await Usuario.findById(id);
    if (!validaPorId) {
        throw new Error(`El ID:${id} no existe en Usuarios`);
    };
};

const existeCategoriaId = async (id = '') => {

    const validaPorId = await Categoria.findById(id);
    if (!validaPorId) {
        throw new Error(`El ID:${id} no existe en Categorias`);
    };
};

const existeProductoId = async (id = '') => {
    const validaPorId = await Producto.findById(id);
    if (!validaPorId) {
        throw new Error(`El ID:${id} no existe en Productos`);
    };
    return true;
};
const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
    const permitidas = colecciones.includes(coleccion);
    if (!permitidas) {
        throw new Error(`La coleccion ${coleccion} no es permitida ${colecciones}`)
    };
    return true;
};





module.exports = {
    roleValidator,
    existeEmail,
    existeUsuarioId,
    existeCategoriaId,
    existeProductoId,
    coleccionesPermitidas


}