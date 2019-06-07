var express = require('express');
var Usuario = require('../models/usuario');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var middlewareAutenticacion = require('../middlewares/autenticacion');

var app = express();

// ==============================
//    Obtener todos los uaurios
// ==============================

app.get('/', (req, res, next) => {
    // busca solament los campos email, nombre, img y role
    // skip salta el numero de los registros
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombre email img role google')
        .skip(desde)
        .limit(5)
        .exec((error, usuarios) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando usuario',
                    errors: error
                });
            }

            Usuario.countDocuments({}, (error, conteo) => {
                res.status(200).json({
                    ok: true,
                    usuarios,
                    total: conteo
                });
                // status 200 todo salio bien
            })

        });

})

// ==========================
// Verificar token
// ver si se creo, no ha expirado y si es valido
// middleware ver si es valido
// ==========================


// ==========================
// Actualizar usuario
// ==========================

app.put('/:id', [middlewareAutenticacion.verificaToken, middlewareAutenticacion.verificaADMIN_o_Mismo_Usuario], (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (error, userDB) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: error
            });
        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id: ' + id + 'no existe',
                errors: { message: 'No existe el id' }
            });
        }


        userDB.nombre = body.nombre;
        userDB.email = body.email;
        userDB.role = body.role;

        userDB.save((error, userSaved) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el usuario',
                    errors: error
                });
            }
            userSaved.password = ':)';
            res.status(200).json({
                ok: true,
                usuer: userSaved
            });

        });

    });

});



// ==========================
// Crear un nuevo usuario
// ==========================

app.post('/', (req, res) => {
    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password),
        img: body.img,
        role: body.role
    });



    usuario.save((error, usuario) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: error
            });
        }

        res.status(201).json({
            ok: true,
            usuario,
            usuarioToken: req.usuario
        });


    });

});


// ==========================
//  eliminar un usuario
// ==========================

app.delete('/:id', [middlewareAutenticacion.verificaToken, middlewareAutenticacion.verificaADMIN_o_Mismo_Usuario], (req, res) => {
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (error, usuarioBorrado) => {

        if (error) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al borrar el usuario con el id: ' + id + 'numero',
                errors: error
            });
        }


        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el usuario con el id: ' + id + 'no existe',
                errors: error
            });
        }


        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });

    });
});


// exportamos el app 

module.exports = app;