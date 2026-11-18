const Viaje = require('../models/viajeSchema')

const obtenerViajes = async (req, res) => {
  try {
    const viajes = await Viaje.find()
      .sort({ horaSalida: -1 })
      .populate('conductor', 'nombre')
      .populate(
        'paradas.remesa',
        'codigo destinatario ciudadDestino barrioDestino direccionDestino estado motivoNoEntrega'
      )

    return res.status(200).json(viajes)
  } catch (error) {
    return res.status(500).json({
      msg: `Error al obtener los viajes: ${error.message}`
    })
  }
}

module.exports = { obtenerViajes }
