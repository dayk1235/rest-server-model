const { response } = require("express");


const esAdminRole = (req, res = response, next) => {

    //* Verifica que venga el token
    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol, sin validar token'
        }); 
    };

    const { rol, nombre } = req.usuario;
    
    //*Verifica que pueda elimiar en BD 
    if (rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${nombre} No tiene los permisos para eliminar usuarios de DB`
        })
    }

    next();
};


const tieneRole = (...roles) => {

    return (req, res = response, next) => {

        //* Verifica que venga el token
        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Se quiere verificar el rol, sin validar token'
            });
        };

        const rol = req.usuario.rol;

        if (!roles.includes(rol)) {

            return res.status(401).json({
                msg: `Esta acción requiere estos roles: ${roles}`,
            })
        };

        next();
    }
};



module.exports = {
    esAdminRole,
    tieneRole
}