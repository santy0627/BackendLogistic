const mongoose = require('mongoose')
const { ciudades } = require('../constants/ciudades')

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
  direccionDestino: {
    type: String,
    required: true
  },
  ciudadDestino: {
    type: String,
    enum: ciudades,
    required: true
  },
  tipoMercancia: {
    type: String,
    enum: ['cajas', 'pallet', 'sacos'],
    required: true
  },
  estado: {
    type: String,
    enum: ['enBodega', 'cargada', 'enTransito', 'entregado', 'asignada'],
    default: 'enBodega'
  },
  remitente: {
    type: String,
    required: true
  },
  destinatario: {
    type: String,
    required: true
  },
  ciudadOrigen: {
    type: String,
    enum: ciudades,
    required: true
  },
  barrioDestino: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Remesa', remesaSchema)
