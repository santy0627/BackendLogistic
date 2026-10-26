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
    },
    remesasAsignadas: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Remesa' }],
        default: []
    },
    conductorAsignado: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
})

module.exports = mongoose.model('Camion', camionSchema)