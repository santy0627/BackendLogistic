const mongoose = require('mongoose')
const { ciudades } = require('../constants/ciudades')

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
  remesasCargadas: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Remesa' }],
    default: []
  },
  remesasAsignadas: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Remesa' }],
    default: []
  },
  conductorAsignado: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  ciudadOperacion: {
    type: String,
    enum: ciudades,
    required: true
  }
})

module.exports = mongoose.model('Camion', camionSchema)
