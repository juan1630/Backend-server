var Hospitales = require('../models/hospitales');
var express = require('express');
var middlewareToken = require('../middlewares/autenticacion');

var app = express();

///////////////////////////////////////
// peticion get 
// ver todos los hospitales
///////////////////////////////////////

app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Hospitales.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec((error, user) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    message: 'Algo ocurrio',
                    errors: {
                        error
                    }
                });
            }

            Hospitales.count({}, (error, conteo) => {
                return res.status(200).json({
                    ok: true,
                    message: 'hospital creado',
                    user,
                    total: conteo
                }); // json
            });
        });
    // exec
});

///////////////////////////////////////
// peticion get 
// fin de los hospitales
///////////////////////////////////////


///////////////////////////////////////
// Creacio de hospitales
// post
///////////////////////////////////////


app.post('/', middlewareToken.verificaToken, (req, res) => {

    var body = req.body;
    console.log(req);

    var hospitales = new Hospitales({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospitales.save((error, userCreated) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                message: 'algo pasó',
                error
            });

        } else {
            return res.status(200).json({
                ok: true,
                message: 'User created',
                userCreated
            });
        }
    });

});

///////////////////////////////////////
// fin del post
///////////////////////////////////////


///////////////////////////////////////
// Elimanod hospital
//  delete
///////////////////////////////////////

app.delete('/:id', middlewareToken.verificaToken, (req, res) => {
    var id = req.params.id;

    Hospitales.findByIdAndRemove(id, (error, userDeleted) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                message: 'Algo salió mal',
                error
            });

        }

        if (!userDeleted) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el hospital con el id: ' + id + ' no existe',
                errors: error
            });
        }

        if (userDeleted) {
            return res.status(200).json({
                ok: true,
                message: 'user was created',
                userDeleted
            });
        }
    });
});


///////////////////////////////////////
// fin del delete
///////////////////////////////////////



///////////////////////////////////////
// Actualización 
// PUT
///////////////////////////////////////


app.put('/:id', middlewareToken.verificaToken, (req, res) => {
    var body = req.body;
    var id = req.params.id;


    Hospitales.findById(id, (error, userUpdated) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                message: 'Algo salió mal de nuevo',
                error
            }); // json del error
        }

        if (!userUpdated) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id: ' + id + 'no existe',
                errors: { message: 'No existe el id' }
            });
        }

        userUpdated.nombre = body.nombre;
        userUpdated.usuario = req.usuario._id;

        userUpdated.save((error, userSaved) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    message: 'Usuario no encontrado',
                    error
                });

            }

            if (userSaved) {
                return res.status(200).json({
                    ok: true,
                    message: 'Usuaurio actualizado',
                    userSaved
                });
            }

            return res.status(200).json({
                ok: true,
                message: 'Hospital actualizado',
                user: userUpdated
            }); // fin deljson


        });

    }); // fin de la funcion

}); // fin del put 


///////////////////////////////////////
// Fin de la  Actualización
//     PUT
///////////////////////////////////////


// exportamos los hospitales para poder utlizarlos en el index

module.exports = app;