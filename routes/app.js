var express = require('express')
var app = express();


app.get('/', (req, res) => {
    res.status(200).json({
            ok: true,
            mensaje: 'peticion realizada correctamente'
        })
        // status 200 todo salio bien
})

// exportamos el app 
module.exports = app;