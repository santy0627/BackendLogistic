const mongoose = require('mongoose')

const camionSchema = new mongoose.Schema({
    placa: {
        type: String,
        required: true,
        unique: true
    },
    capacidadCarga: {
        type: Number,
        required: true 
    },
    disponible: {
        type: Boolean,
        default: true
    },
    ubicacionActual: {
        type: String,
        enum: ['bodega', 'enRuta'],
        default: 'bodega'
    }
})

module.exports = mongoose.model('Camion', camionSchema)