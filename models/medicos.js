var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var medicoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: false },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: false }
});

// agregar los required para el usuario y el hospital
module.exports = mongoose.model('Medico', medicoSchema);