var Medicos = require('../models/medicos');
var express = require('express');

var midleware = require('../middlewares/autenticacion');

// inicializamos express 

var app = express();



///////////////////////////////////////
// peticion get 
// ver todos los medicos
///////////////////////////////////////


app.get('/', (req, res) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medicos.find({}).
    populate('usuario', 'nombre email')
        .skip(desde)
        .limit(5)
        .populate('hospital')
        .exec((error, users) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    message: 'algo ocurrio',
                    error
                });
            }
            Medicos.count({}, (error, conteo) => {

                return res.status(200).json({
                    ok: true,
                    message: 'Usuarios',
                    users,
                    total: conteo
                });

            });

        });
});


///////////////////////////////////////
// Termina la peticion get 
// ver todos los medicos
///////////////////////////////////////



///////////////////////////////////////
//  peticion get 
// ver un medico
///////////////////////////////////////


app.get('/:id', (req, res) => {
    let id = req.params.id;

    Medicos.findById(id)
        .populate('usuario', 'nombre email img')
        .populate('hospital')
        .exec((error, medicoDB) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    message: 'algo ocurrio',
                    error
                });
            }

            if (!medicoDB) {
                return res.status(400).json({
                    ok: false,
                    message: "Medico no encotrado",
                    errors: {
                        message: 'no existe medico'
                    }
                })
            }


            return res.status(200).json({
                ok: true,
                mansaje: "Medico encontardo",
                medicoDB: medicoDB
            });
        });


});

///////////////////////////////////////
// Termina la peticion get 
// ver un medico
///////////////////////////////////////




///////////////////////////////////////
//  peticion post 
// ver todos los medicos
///////////////////////////////////////


app.post('/', midleware.verificaToken, (req, res) => {
    var body = req.body;

    var medico = new Medicos({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });
    medico.save((error, user) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: error
            });
        }

        if (user) {
            return res.status(201).json({
                ok: true,
                message: 'Medico was created',
                user
            });

        }
    });
});


///////////////////////////////////////
// Termina peticion post 
// ver todos los medicos
///////////////////////////////////////


///////////////////////////////////////
//  peticion delete 
// ver todos los medicos
///////////////////////////////////////


app.delete('/:id', midleware.verificaToken, (req, res) => {
    let id = req.params.id;

    Medicos.findByIdAndRemove(id, (error, userDeleted) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                message: 'Algo pasó',
                error
            });
        }
        if (userDeleted) {
            return res.status(200).json({
                ok: true,
                message: 'User deleted',
                userDeleted
            });

        }
    }); // find

});


///////////////////////////////////////
// Termina peticion delete 
// ver todos los medicos
///////////////////////////////////////


///////////////////////////////////////
//  peticion put 
// ver todos los medicos
///////////////////////////////////////


app.put('/:id', midleware.verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;


    Medicos.findById(id, (error, userDB) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                message: 'Algo salio mal',
                error
            });
        }
        if (!userDB) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontró el usuario',
                error
            });
        }

        userDB.nombre = body.nombre;
        userDB.usuario = req.usuario._id;
        userDB.hospital = body.hospital;

        userDB.save((error, userSaved) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    message: 'Algo ocurrió',
                    error
                });
            }

            if (userSaved) {
                return res.status(200).json({
                    ok: true,
                    message: 'El usuario fue elemindo',
                    userSaved
                });
            }
        });
    });
});

///////////////////////////////////////
// Termina peticion put 
// ver todos los medicos
///////////////////////////////////////


module.exports = app;