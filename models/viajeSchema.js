const mongoose = require('mongoose')

const paradaSchema = new mongoose.Schema( // historial de las remesas dentro del viaje
  {
    remesa: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Remesa',
      required: true
    },
    orden: {
      type: Number,
      required: true
    },
    resultado: {
      type: String,
      enum: ['pendiente', 'entregado', 'noEntregada'],
      default: 'pendiente'
    },
    motivoNoEntrega: {
      type: String,
      trim: true,
      default: null
    },
    horaEntrega: {
      type: Date,
      default: null
    }
  },
  { _id: false }
)

const viajeSchema = new mongoose.Schema(
  {
    camion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Camion',
      required: true
    },
    placa: { // por si se elimina el camion
      type: String,
      required: true
    },
    conductor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    paradas: { // las remesas del viaje, en el orden que se habia planeado entregar
      type: [paradaSchema],
      default: []
    },
    fechaEntrega: { // dia en que se hicieron las entregas
      type: Date,
      required: true
    },
    horaSalida: {
      type: Date,
      required: true,
      default: Date.now
    },
    horaRegreso: {
      type: Date,
      default: null
    },
    estado: {
      type: String,
      enum: ['enCurso', 'finalizado'],
      default: 'enCurso'
    }
  },
  { timestamps: true }
)

viajeSchema.index({ camion: 1 }, { unique: true, partialFilterExpression: { estado: 'enCurso' } }) // solo puede tener un viaje en curso

module.exports = mongoose.model('Viaje', viajeSchema)
