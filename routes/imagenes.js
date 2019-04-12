var express = require('express')
var app = express();

const path = require('path');
const fs = require('fs');


app.get('/:tipo/:img', (req, res) => {

    var img = req.params.img;
    var tipo = req.params.tipo;
    var pathImg = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        var pathnoImg = path.resolve(__dirname, `../assets/no-img.jpg`);
        res.sendFile(pathnoImg);
    }

});

// exportamos el app 
module.exports = app;