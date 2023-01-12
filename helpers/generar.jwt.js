const jwt = require('jsonwebtoken');

const generarJWT = (uid = '') => {

    return new Promise((resolve, reject) => {

        const payload = { uid };

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '1hr',
            
        }, (err, token) => {

            if (err) {
                console.log(err);
                reject('El JWT no se pudo generar');
            } else {
                resolve(token);
            };

        });

    });
};


module.exports = {
    generarJWT
};