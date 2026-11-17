const mongoose = require('mongoose')
const { ciudades } = require('../constants/ciudades')

const camionSchema = new mongoose.Schema(
  {
    placa: {
      type: String,
      required: true,
      unique: true
    },
    capacidadCarga: {
      type: Number,
      required: true
    },
    operativo: { // false = fuera de servicio (no se le pueden asignar rutas)
      type: Boolean,
      default: true
    },
    ubicacionActual: {
      type: String,
      enum: ['enBodega', 'enRuta'],
      default: 'enBodega'
    },
    ruta: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Remesa' }], // remesas del camion en orden de entrega
      default: []
    },
    conductor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    ciudadOperacion: {
      type: String,
      enum: ciudades,
      required: true
    }
  },
  { timestamps: true }
)

camionSchema.index( // un conductor solo puede tener un camion asignado
  { conductor: 1 },
  { unique: true, partialFilterExpression: { conductor: { $type: 'objectId' } } }
)

module.exports = mongoose.model('Camion', camionSchema)
