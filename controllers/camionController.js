const Camion = require('../models/camionSchema')
const Remesa = require('../models/remesaSchema')
const { ordenarRemesas } = require('../utils/rutas')

const obtenerCamiones = async (req, res) => {
  try {
    const camiones = await Camion.find()
      .populate('conductorAsignado', 'nombre')
      .populate('remesasAsignadas')
      .populate('remesasCargadas')

    return res.status(200).json(camiones)
  } catch (error) {
    return res.status(500).json({
      msg: `Error al obtener los camiones: ${error.message}`
    })
  }
}

const crearCamion = async (req, res) => {
  try {
    const {
      placa,
      capacidadCarga,
      conductorAsignado,
      disponible,
      ubicacionActual,
      ciudadOperacion,
      remesasAsignadas,
      remesasCargadas
    } = req.body

    let camion = await Camion.findOne({ placa })
    if(conductorAsignado) {
      const ocupado = await Camion.findOne({ conductorAsignado })
      if (ocupado) return res.status(400).json({
        msg: 'El conductor ya está asignado a otro camión'
      })
    }

    if (camion) {
      return res.status(400).json({
        msg: 'El camion ya existe en la base de datos'
      })
    }

    camion = new Camion({
      placa: placa,
      capacidadCarga: capacidadCarga,
      conductorAsignado: conductorAsignado || null,
      disponible: disponible ?? true,
      ubicacionActual: ubicacionActual ?? 'bodega',
      ciudadOperacion: ciudadOperacion,
      remesasAsignadas: remesasAsignadas,
      remesasCargadas: remesasCargadas
    })

    await camion.save()

    return res.status(201).json({
      msg: 'Camion registrado exitosamente'
    })
  } catch (error) {
    return res.status(500).json({
      msg: `Error al crear el camion: ${error.message}`
    })
  }
}

const actualizarCamion = async (req, res) => {
  try {
    const { disponible } = req.body

    const camion = await Camion.findById(req.params.id)

    if (camion.remesasAsignadas.length > 0 || camion.remesasCargadas.length > 0) {
      return res.status(400).json({
        msg: 'No puedes desactivar un camión que tiene remesas asignadas o cargadas'
      })
    }

    await Camion.findByIdAndUpdate(req.params.id, { disponible }, { new: true })

    return res.status(200).json({
      msg: 'Disponibilidad del camión actualizada exitosamente',
      camion
    })
  } catch (error) {
    return res.status(500).json({
      msg: `Error al actualizar el camión: ${error.message}`
    })
  }
}

const salirRuta = async (req, res) => {
  try {

    const camion = await Camion.findById(req.params.id)

    if(!camion) {
      return res.status(400).json({
        msg: 'El camión no existe en la base de datos'
      })
    }

    if(camion.ubicacionActual === 'bodega') {
      if(camion.remesasAsignadas.length > 0) {
        return res.status(400).json({
          msg: 'No puedes salir a ruta sin cargar todas las remesas asignadas'
        })
      }

      await Remesa.updateMany(
        { _id: { $in: camion.remesasCargadas } },
        { $set: { estado: 'enTransito' } }
      );

      camion.ubicacionActual = 'enRuta';
      
    } else if (camion.ubicacionActual === 'enRuta') {
      await Remesa.updateMany(
        {
          _id: { $in: camion.remesasCargadas },
          estado: 'enTransito'
        },
        {
          $set: { estado: 'cargada' }
        }
      );
      camion.ubicacionActual = 'bodega';
      
    } else {
      return res.status(400).json({
        msg: 'Ubicación no válida'
      });
    }
    await camion.save();

    return res.status(200).json({
      msg: 'Ubicación del camión actualizada exitosamente',
      camion
    })
  } catch (error) {
    return res.status(500).json({
      msg: `Error al actualizar el camión: ${error.message}`
    })
  }
}

const eliminarCamion = async (req, res) => {
  try {
    const camion = await Camion.findById(req.params.id)

    if (!camion)
      return res.status(500).json({
        msg: 'El camión no existe'
      })

    if (camion.remesasCargadas.length > 0) {
      return res.status(400).json({
        msg: 'No puedes eliminar un camión ya cargado'
      })
    }

    if (camion.ubicacionActual === 'enRuta') {
      return res.status(400).json({
        msg: 'No puedes eliminar un camión en ruta'
      })
    }

    await Remesa.updateMany({ _id: { $in: camion.remesasAsignadas } }, { estado: 'enBodega' })

    await Camion.findByIdAndDelete(camion._id)

    return res.status(200).json({ msg: 'Camion eliminado y remesas actualizadas' })
  } catch (error) {
    return res.status(500).json({
      msg: ` Error eliminando camion: ${error.message}`
    })
  }
}

const asignarRemesas = async (req, res) => {
  try {
    const { id } = req.params

    const camion = await Camion.findById(id)

    if (!camion) {
      return res.status(400).json({
        msg: 'El camion no existe en la base de datos'
      })
    }

    if(camion.disponible === false) {
      return res.status(400).json({
        msg: 'El camión no está disponible para asignar remesas'
      })
    }

    const remesasDisponibles = await Remesa.find({
      ciudadDestino: camion.ciudadOperacion,
      estado: 'enBodega'
    })

    if (remesasDisponibles.length === 0) {
      return res.status(400).json({
        msg: 'No hay remesas disponibles en esta ciudad'
      })
    }

    const remesasOrdenadas = ordenarRemesas(camion.ciudadOperacion, remesasDisponibles)

    const remesasACargar = []
    let pesoAcumulado = 0

    for (const remesa of remesasOrdenadas) {
      if (pesoAcumulado + remesa.pesoTotal <= camion.capacidadCarga) {
        pesoAcumulado += remesa.pesoTotal
        remesasACargar.push(remesa._id)
      }
    }

    if (remesasACargar.length === 0) {
      return res.status(400).json({
        msg: 'Ninguna remesa cabe en la capacidad del camión'
      })
    }

    camion.remesasAsignadas = remesasACargar

    await camion.save()

    await Remesa.updateMany({ _id: { $in: remesasACargar } }, { estado: 'asignada' })

    return res.status(200).json({
      msg: 'Remesas asignadas correctamente'
    })
  } catch (error) {
    return res.status(500).json({
      msg: `Error asignando remesas: ${error.message}`
    })
  }
}

const cargarRemesa = async (req, res) => {
  try {
    const { id, remesaId } = req.params

    const camion = await Camion.findOneAndUpdate(
      { _id: id, remesasAsignadas: remesaId },
      {
        $pull: { remesasAsignadas: remesaId },
        $addToSet: { remesasCargadas: remesaId }
      },
      { new: true }
    )

    if (!camion) {
      return res.status(400).json({
        msg: 'La remesa no está asignada a este camión'
      })
    }

    await Remesa.findByIdAndUpdate(remesaId, { estado: 'cargada' })

    return res.status(200).json({
      msg: 'La remesa fue cargada exitosamente'
    })
  } catch (error) {
    return res.status(500).json({
      msg: `Error cargando remesa: ${error.message}`
    })
  }
}

module.exports = {
  crearCamion,
  actualizarCamion,
  obtenerCamiones,
  eliminarCamion,
  asignarRemesas,
  cargarRemesa,
  salirRuta
}
