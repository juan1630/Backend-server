// requires importa las librerias 

var express = require('express')
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// inicializar las variables
var app = express();

// body parser 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// importatr rutas 

var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');


// Conexion a la base de datos

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (error, response) => {
    if (error) throw error;

    console.log('Base de datos en 27017: \x1b[32m%s\x1b[0m', 'online');
});

// rutas

app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);


// rest



// escuchar peticiones

app.listen(3000, () => {
    console.log('servidor corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});