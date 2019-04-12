var express = require('express');

var app = express();

// models

var Hospitales = require('../models/hospitales');
var Medicos = require('../models//medicos');
var Usuario = require('../models/usuario');


//=======================
// Busqueda especifica
//=======================

app.get('/coleccion/:tabla/:busqueda', (req, res) => {
    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');
    var promesa;

    switch (tabla) {
        case 'usuario':
            promesa = buscarUsuario(busqueda, regex);
            break;

        case 'medico':
            promesa = buscarMedicos(busqueda, regex);
            break;

        case 'hospital':
            promesa = buscarHospitales(busqueda, regex);
            break;
        default:
            return res.status(400).json({
                ok: false,
                message: 'Los tipos de buqueda solo son medicos, hospitales y uaurios ',
                error: {
                    message: 'tipo de tabla/coleccion no valido'
                }
            });
    }

    promesa.then(
        data => {
            return res.status(200).json({
                ok: true,
                [tabla]: data
            });
        }
    )

});

//======================
//  Busqueda general
//======================


app.get('/todo/:busqueda', (req, res) => {
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');
    // agregamos una expresion regular

    Promise.all([
            buscarHospitales(busqueda, regex),
            buscarMedicos(busqueda, regex),
            buscarUsuario(busqueda, regex)
        ])
        .then(respuestas => {
            return res.status(200).json({
                ok: true,
                message: 'Consulta hecha',
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuario: respuestas[2]
            });
        });
});


function buscarHospitales(busqueda, regex) {
    // creamos la promesa

    return new Promise((resolve, reject) => {
        Hospitales.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec(
                (error, hospitales) => {
                    if (error) {
                        reject('Error al cargar la data'), error;
                    } else {
                        resolve(hospitales);
                        // resovemos con la data
                    }
                });
    });
}



function buscarMedicos(busqueda, regex) {
    // creamos la promesa

    return new Promise((resolve, reject) => {
        Medicos.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec(
                (error, medicos) => {
                    if (error) {
                        reject('Error al cargar la data de los medicos'), error;
                    } else {
                        resolve(medicos);
                        // resovemos con la data
                    }
                });
    });
}



function buscarUsuario(busqueda, regex) {
    // creamos la promesa

    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role')
            // buscamos esos tres campos
            .or({ 'nombre': regex }, { 'email': regex })
            .exec(
                (error, medicos) => {
                    if (error) {
                        reject('Error al cargar los usarios'), error;
                    } else {
                        resolve(medicos);
                        // resovemos con la data
                    }
                }
            );
    });
}

module.exports = app;