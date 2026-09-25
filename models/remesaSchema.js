const mongoose = require('mongoose')

const remesaSchema = new mongoose.Schema({
    codigo: {
        type: Number,
        required: true,
        unique: true
    },
    cantidad: {
        type: Number,
        required: true
    },
    pesoTotal: {
        type: Number,
        required: true
    },
    direccionEntrega: {
        type: String,
        required: true
    },
    ciudadEntrega: {
        type: String,
        required: true
    },
    tipoMercancia: {
        type: String,
        enum: ['cajas', 'pallet', 'sacos'],
        required: true
    },
    estado: {
        type: String,
        enum: ['enBodega', 'cargada', 'enTransito', 'entregado'],
        default: 'enBodega'
    }
})

module.exports = mongoose.model('Remesa', remesaSchema)