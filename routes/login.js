// google
var { CLIENT_ID } = require('../config/config');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);


var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var app = express();
var Usuario = require('../models/usuario');
var SEED = require('../config/config').SEED;


//========================================
//
// Autenticacion normal
//
//========================================



app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (error, userDB) => {


        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: error
            });
        }

        if (!userDB) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: error,
                message: body.email
            });
        }

        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: error
            });
        }

        // crear un toke digo token XD
        userDB.password = ':)';

        var token = jwt.sign({ usuario: userDB }, SEED, { expiresIn: 14400 });
        // se define una semilla y tambien se define la expiración en este caso 4 horas
        res.status(200).json({
            ok: true,
            usuario: userDB,
            token,
            id: userDB._id
        });
    });

});

//========================================
//
// Autenticacion Google
//
//========================================


async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };

}



app.post('/google', async(req, res) => {


    var token = req.body.token;
    var googleUser = await verify(token)
        .catch(error => {
            return res.status(403).json({
                ok: false,
                mensaje: "token no valido",
                error
            });
        });


    Usuario.findOne({ email: googleUser.email }, (error, userDB) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: error
            });
        }


        if (userDB) {

            if (userDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Debe usar su autenticacion normal',
                    errors: error
                });
            } else {

                var token = jwt.sign({ usuario: userDB }, SEED, { expiresIn: 14400 });
                // se define una semilla y tambien se define la expiración en este caso 4 horas
                res.status(200).json({
                    ok: true,
                    usuario: userDB,
                    token,
                    id: userDB._id
                });
            }

            //  return res.status(500).json({
            //      ok: false,
            //      mensaje: 'Error al buscar usuario',
            //      errors: error
            //  });
        } else {
            // el usuario no existe crearlo


            var usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';



            usuario.save((error, usuarioB) => {
                if (error) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al buscar usuario',
                        errors: error
                    });
                }

                var token = jwt.sign({ usuario: usuarioB }, SEED, { expiresIn: 14400 });
                // se define una semilla y tambien se define la expiración en este caso 4 horas
                res.status(200).json({
                    ok: true,
                    usuario: usuarioB,
                    token: token,
                    id: usuarioB._id
                });

            });
        }
    });
});


module.exports = app;