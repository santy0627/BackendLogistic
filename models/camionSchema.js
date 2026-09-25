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
    }
})

module.exports = mongoose.model('Camion', camionSchema)