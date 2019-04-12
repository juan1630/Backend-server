// importamos las dependencias 

var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

// ejecutamos el express
var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medicos');
var Hospital = require('../models/hospitales');


// usamos el middleware 
app.use(fileUpload());


app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;


    // obtener nombre del archivo

    var archivo = req.files.imagen;
    var extension = archivo.name.split('.');
    var extensionArchivo = extension[extension.length - 1];
    console.log(extensionArchivo);



    var tiposValidos = ['medico', 'hospital', 'usuario'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(500).json({
            ok: false,
            message: 'Tipo de coleccion no valido',
            error: {
                message: 'Tipo de coleccion no valido'
            }
        });
    }

    if (!req.files) {
        return res.status(500).json({
            ok: false,
            message: 'No se selccionó nada',
            error: {
                mesaage: 'se debde dseleccionar una imagen'
            }
        });
    }

    // solo estos archivos

    var validas = ['png', 'jpg', 'gif', 'jpeg'];

    if (validas.indexOf(extensionArchivo) < 0) {
        return res.status(500).json({
            ok: false,
            message: 'etension no valida',
            error: {
                mesaage: 'las extensiones validas  son' + validas.join(',')
            }
        });
    }

    // Nombre de la imagen personalizado
    var nombreArchico = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    // moverl la imagen al path requerido
    var path = `./uploads/${tipo}/${nombreArchico}`;
    archivo.mv(path, error => {

        if (error) {
            return res.status(500).json({
                ok: false,
                message: 'Extension no valida',
                error: {
                    mesaage: 'las extensiones validas  son' + validas.join(',')
                }
            });
        }

        subirPorTipo(tipo, id, nombreArchico, res);

        //  res.status(200).json({
        //      ok: true,
        //      mensaje: 'peticion realizada correctamente',
        //      nombre: extensionArchivo
        // });
        // status 200 todo salio bien
    });



});




function subirPorTipo(tipo, id, nombreArchico, res) {

    if (tipo == 'usuario') {
        Usuario.findById(id, (error, userDB) => {
            if (!userDB) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Usuario no existe',
                    erros: {
                        message: 'usuario no existe'
                    }
                });
            }
            if (error) {
                console.log(error);
            }
            // si existe una imagen vieja la borra 
            var pathViejo = './uploads/usuario/' + userDB.img;


            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, error => {
                    console.log(error);
                });
            }

            userDB.img = nombreArchico;
            userDB.save((error, userUp) => {

                if (error) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Imagen no guardada',
                        user: userUp
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen actualizada',
                    nombre: userUp
                });
            });

        });
    }
    if (tipo == 'medico') {
        Medico.findById(id, (error, medico) => {


            if (error) {
                console.log(error);
            }


            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'medico no existe',
                    erros: {
                        message: 'medico no existe'
                    }
                });
            }


            var pathViejo = './uploads/medico/' + medico.img;

            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, (error) => {
                    console.log(error);
                });
            }
            medico.img = nombreArchico;
            medico.save((error, medicoUp) => {
                medicoUp.password = ':)';
                if (error) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Imagen no guardada',
                        user: medicoUp
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen actualizada',
                    nombre: medicoUp
                });

            });
        });
    }

    if (tipo == 'hospital') {
        Hospital.findById(id, (error, hospitalDB) => {
            if (error) {
                console.log(error);
            }

            if (!hospitalDB) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'hospital no existe',
                    erros: {
                        message: 'hospital no existe'
                    }
                });
            }

            var pathViejo = './uploads/hospital/' + hospitalDB.img;

            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, (error) => {
                    console.log(error);
                });
            }
            hospitalDB.img = nombreArchico;
            hospitalDB.save((error, hospitalUp) => {
                if (error) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Imagen no guardada',
                        user: hospitalUp
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen actualizada',
                    nombre: hospitalUp
                });

            });
        });
    }
}


// exportamos el app 
module.exports = app;