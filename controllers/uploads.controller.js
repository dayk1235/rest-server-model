const fs = require('fs');
const path = require('path')
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const subirArchivo = require('../helpers/subir-archivo');
const { Usuario, Producto } = require('../models');


const cargaArchivos = async (req = request, res = response) => {

    try {
        // const nombreFinalUid = await subirArchivo(req.files, undefined, 'productos');
        const nombreFinalUid = await subirArchivo(req.files);

        res.json({ nombreFinalUid });

    } catch (error) {
        return res.status(400).json({
            error
        });
    };
};

const actualizarArchivoImg = async (req = request, res = response) => {

    const { coleccion, id } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    error: `El id ${id} no se encuentra en usuarios`
                });
            };
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    error: `El id ${id} no se encuentra en productos`
                });
            };
            break;

        default:
            return res.status(500).json({ msg: 'End-point fuera de servicio' });
    };

    const pathColecciones = coleccion + '-' + 'img';

    if (modelo.img) {
        const pathImagen = path.join(__dirname, '../uploads', pathColecciones, modelo.img);
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        };
    };

    //Nos regresa el nombre de la imagen que subio;
    const nombreImagen = await subirArchivo(req.files, ['jpg', 'png', 'jpeg', 'gif'], pathColecciones);

    modelo.img = nombreImagen;

    await modelo.save();

    res.status(200).json({
        modelo
    });
};

const actualizarArchivoImgCloud = async (req = request, res = response) => {

    const { coleccion, id } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    error: `El id ${id} no se encuentra en usuarios`
                });
            };
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    error: `El id ${id} no se encuentra en productos`
                });
            };
            break;

        default:
            return res.status(500).json({ msg: 'End-point fuera de servicio' });
    };

    //Para que borre la imagen anterior del usuario y no genere imagenes basura
    if (modelo.img) {
        const nombreArr = modelo.img.split('/'); //Se corta el nombre de la img
        const nombre = nombreArr[nombreArr.length - 1]; //Selecionamos la parte que vamos a ocupar del string
        const [public_id, extencion] = nombre.split('.'); //Extraemos el nombre de la img
        cloudinary.uploader.destroy(public_id); //Se elimina de cloudinary
    };

    //Subida a Cloudinary
    const { tempFilePath } = req.files.archivo;
    const url = await cloudinary.uploader.upload(tempFilePath);
    const { secure_url } = url;
    modelo.img = secure_url;
    await modelo.save();

    res.status(200).json({
        modelo
    });
};

const mostarArchivoImg = async (req, res = response) => {
    const { coleccion, id } = req.params;
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    error: `El id ${id} no se encuentra en usuarios`
                });
            };
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    error: `El id ${id} no se encuentra en productos`
                });
            };
            break;

        default:
            return res.status(500).json({ msg: 'EndPonit en desarrollo' });
    };

    const pathColecciones = coleccion + '-' + 'img';

    if (modelo.img) {
        const pathImagen = path.join(__dirname, '../uploads', pathColecciones, modelo.img)
        if (fs.existsSync(pathImagen)) {
            return res.status(200).sendFile(pathImagen);
        };
    };

    const pathNoImagen = path.join(__dirname, '../assets', 'no-image.jpg');
    res.status(404).sendFile(pathNoImagen);

};



module.exports = {
    cargaArchivos,
    actualizarArchivoImg,
    mostarArchivoImg,
    actualizarArchivoImgCloud
};