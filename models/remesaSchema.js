const mongoose = require('mongoose')
const { ciudades } = require('../constants/ciudades')

const remesaSchema = new mongoose.Schema(
  {
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
    barrioDestino: {
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
      enum: ['enBodega', 'asignada', 'cargada', 'enTransito', 'entregado', 'noEntregada'],
      default: 'enBodega'
    },
    motivoNoEntrega: { // obligatoria cuando su estado es noEntregada
      type: String,
      trim: true,
      default: null,
      required: function () {
        return this.estado === 'noEntregada'
      }
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
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Remesa', remesaSchema)
