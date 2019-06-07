var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

// ==========================
// Verificar token
// ver si se creo, no ha expirado y si es valido
// middleware ver si es valido
// ==========================


exports.verificaToken = function(req, res, next) {
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


// ==========================
// Verificar Admin
// ver si se el usuario es admin o no
// modificar a los demas usuarios 
// ==========================


exports.verificaADMIN_ROLE = function(req, res, next) {
    var usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto - no es administrador',
            errors: error
        });
    }

}


// ==========================
// Verificar Admin
// ver si se el usuario es admin o no
// modificar a los demas usuarios 
// ==========================


exports.verificaADMIN_o_Mismo_Usuario = function(req, res, next) {
    var usuario = req.usuario;
    var id = req.params.id;


    if (usuario.role === 'ADMIN_ROLE' || usuario._id === id) {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto - no es administrador Ni es el mismo usuario',
            errors: error
        });
    }
}