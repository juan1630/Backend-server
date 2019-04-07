var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

// ==========================
// Verificar token
// ver si se creo, no ha expirado y si es valido
// middleware ver si es valido
// ==========================


exports.verificaToken = function (req, res, next ) {
        var token = req.query.token;
    // recibe el token por la url
    jwt.verify(token, SEED, (error, decoded) => {
        if (error) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: error
            });
        }
        req.usuario = decoded.usuario;
         // esta informacion va  a estar disponible en cualquier lugar en el req
         next();
    });
    
}
