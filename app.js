// requires importa las librerias 

var express = require('express')
var mongoose = require('mongoose');

// inicializar las variables
var app = express();



// Conexion a la base de datos

mongoose.connection.openUri('mongodb://localhost:27017/hospitalesDB', (error, response) => {
    if (error) throw error;

    console.log('Base de datos en 27017: \x1b[32m%s\x1b[0m', 'online');
});

// rutas

app.get('/', (req, res) => {
    res.status(200).json({
            ok: true,
            mensaje: 'peticion realizada correctamente'
        })
        // status 200 todo salio bien
})

// escuchar peticiones

app.listen(3000, () => {
    console.log('servidor corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});