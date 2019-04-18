// requires importa las librerias 

var express = require('express')
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// inicializar las variables
var app = express();

// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST ,  GET ,  PUT ,  DELETE ,  OPTIONS");
    next();
});


// body parser 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// importatr rutas 

var appRoutes = require('./routes/app');
var hospitalesRoutes = require('./routes/hospitales');
var medicosRoutes = require('./routes/medico');
var usuarioRoutes = require('./routes/usuario');
var busquedaRoutes = require('./routes/busqueda');
var uploadsRoues = require('./routes/uploads');
var imagenesRoutes = require('./routes/imagenes');
var loginRoutes = require('./routes/login');


// Conexion a la base de datos

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (error, response) => {
    if (error) throw error;

    console.log('Base de datos en 27017: \x1b[32m%s\x1b[0m', 'online');
});

// server index config
// rutas estaticas

// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'))
// app.use('/uploads', serveIndex(__dirname + '/uploads'));

// rutas
app.use('/usuario', usuarioRoutes);
app.use('/hospital', hospitalesRoutes);
app.use('/medico', medicosRoutes);
app.use('/login', loginRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadsRoues);
app.use('/img', imagenesRoutes);
app.use('/', appRoutes);


// rest



// escuchar peticiones

app.listen(3000, () => {
    console.log('servidor corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});