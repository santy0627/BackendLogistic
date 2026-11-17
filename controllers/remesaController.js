const Remesa = require('../models/remesaSchema')
const Camion = require('../models/camionSchema')

const crearRemesa = async (req, res) => {
  try {
    const { codigo, cantidad, pesoTotal, direccionDestino, ciudadDestino, tipoMercancia, remitente, destinatario, ciudadOrigen, barrioDestino } =
      req.body

    let remesa = await Remesa.findOne({ codigo })

    if (remesa) {
      return res.status(400).json({
        msg: 'La remesa ya existe en la base de datos'
      })
    }

    remesa = new Remesa({
      codigo: codigo,
      cantidad: cantidad,
      pesoTotal: pesoTotal,
      direccionDestino: direccionDestino,
      ciudadDestino: ciudadDestino,
      barrioDestino: barrioDestino,
      tipoMercancia: tipoMercancia,
      remitente: remitente,
      destinatario: destinatario,
      ciudadOrigen: ciudadOrigen,
    })

    await remesa.save()

    return res.status(201).json({
      msg: 'Remesa registrada exitosamente'
    })
  } catch (error) {
    return res.status(500).json({
      msg: `Error al registrar la remesa: ${error.message}`
    })
  }
}

const obtenerRemesas = async (req, res) => {
  try {
    const remesas = await Remesa.find()

    return res.status(200).json(remesas)
  } catch (error) {
    return res.status(500).json({
      msg: `Error al obtener las remesas: ${error.message}`
    })
  }
}

const obtenerRemesasPorEstado = async (req, res) => {
  try {
    const { estado } = req.params

    const estadosValidos = Remesa.schema.path('estado').enumValues

    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({
        msg: 'El estado ingresado es inválido'
      })
    }

    const remesas = await Remesa.find({ estado })
    return res.status(200).json(remesas)
  } catch (error) {
    return res.status(500).json({
      msg: `Error al obtener las remesas por estado: ${error.message}`
    })
  }
}

const actualizarEstado = async (req, res) => {
  try {
    const { estado } = req.body

    const estadosValidos = Remesa.schema.path('estado').enumValues

    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({
        msg: 'El estado ingresado es inválido'
      })
    }

    const remesa = await Remesa.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true })

    if (estado === 'entregada') {
      await Camion.updateMany(
        { ruta: remesa._id },
        {
          $pull: {
            ruta: remesa._id
          }
        }
      );
    }

    return res.status(200).json({
      msg: 'Remesa actualizada exitosamente',
      remesa
    })
  } catch (error) {
    return res.status(500).json({
      msg: `Error al actualizar la remesa: ${error.message}`
    })
  }
}

const eliminarRemesa = async (req, res) => {
  try {
    const remesa = await Remesa.findByIdAndDelete(req.params.id)

    if(remesa.estado !== 'enBodega'){
      return res.status(404).json({
        msg: 'La remesa debe estar en bodega'
      })
    }

    res.status(200).json({ msg: 'Remesa eliminada' })
  } catch (error) {
    return res.status(500).json({
      msg: ` Error eliminando remesa: ${error.message}`
    })
  }
}

const cargarRemesa = async (req, res) => {
  try {
    const { camionId, remesaId } = req.params

    const camion = await Camion.findById(camionId)

    if(!camion) {
      return res.status(404).json({
        msg: 'El camión no existe'
      })
    }

    if(camion.ubicacionActual !== 'enBodega') {
      return res.status(400).json({
        msg: 'No puedes cargar remesas a un camión que ya salió a ruta'
      })
    }

    const remesa = await Remesa.findOneAndUpdate(
      { _id: remesaId, estado: 'asignada' },
      { $set: { estado: 'cargada' } },
      { new: true, runValidators: true }
    )

    if(!remesa) {
      return res.status(409).json({
        msg: 'La remesa no está pendiente de carga'
      })
    }

    return res.status(200).json({
      msg: 'La remesa fue cargada exitosamente'
    })
  } catch (error) {
    return res.status(500).json({
      msg: `Error cargando remesa: ${error.message}`
    })
  }
}

const entregarRemesa = async (req, res) => {
  try {
    const { remesaId } = req.params

    const camion = await Camion.findOne({
      conductor: req.user._id,
      ubicacionActual: 'enRuta',
      ruta: remesaId
    })

    if(!camion){
      return res.status(404).json({
        msg: 'La remesa no está en la ruta activa del camión'
      })
    }

    const remesa = await Remesa.findOneAndUpdate(
      { _id: remesaId, estado: 'enTransito' },
      { $set: { estado: 'entregado' } },
      { new: true, runValidators: true }
    )

    if(!remesa) {
      return res.status(409).json({
        msg: 'La remesa no existe o no está en transito'
      })
    }

    return res.status(200).json({
      msg: 'Remesa entregada correctamente',
      remesa
    })
  } catch (error) {
    return res.status(500).json({
      msg: `Error al entregar la remesa: ${error.message}`
    })
  }
}

const registrarNoEntrega = async (req, res) => {
  try {
    const { remesaId } = req.params
    const motivoNoEntrega = req.body.motivoNoEntrega?.trim()

    if(!motivoNoEntrega){
      return res.status(400).json({
        msg: 'El motivo del porqué no se entregó es necesario'
      })
    }

    const camion = await Camion.findOne({
      conductor: req.user._id,
      ubicacionActual: 'enRuta',
      ruta: remesaId
    })

    if(!camion) {
      return res.status(404).json({
        msg: 'La remesa no está en la ruta activa del camión'
      })
    }

    const remesa = await Remesa.findOneAndUpdate(
      { _id: remesaId, estado: 'enTransito' },
      {
        $set:{
          estado: 'noEntregada',
          motivoNoEntrega
        }
      },
      { new: true, runValidators: true }
    )

    if(!remesa) {
      return res.status(409).json({
        msg: 'La remesa no existe o no está en transito'
      })
    }

    return res.status(200).json({
      msg: 'Registro del motivo exitoso',
      remesa
    })
  } catch (error) {
    return res.status(500).json({
      msg: `Error al registrar el motivo: ${error.message}` 
    })
  }
}

const descargarRemesa = async (req, res) => {
  try {
    const { remesaId } = req.params

    const camion = await Camion.findOne(
      {ruta: remesaId, ubicacionActual: 'enBodega'}
    )

    if(!camion){
      return res.status(404).json({
        msg: 'El camión no existe o sigue en ruta'
      })
    }

    const remesa = await Remesa.findById(remesaId)

    if(!remesa){
      return res.status(404).json({
        msg: 'La remesa no existe'
      })
    }

    await Camion.updateOne(
      { _id: camion._id },
      { $pull: { ruta: remesa._id } }
    )

    await Remesa.updateOne(
      { _id: remesa._id },
      { $set: { estado: 'enBodega', motivoNoEntrega: null } }
    )

    return res.status(200).json({
      msg: 'Remesa descargada exitosamente'
    })
  } catch (error) {
    return res.status(500).json({
      msg: `Error al descargar la remesa: ${error.message}`
    })
  }
}

module.exports = {
  crearRemesa,
  obtenerRemesas,
  obtenerRemesasPorEstado,
  actualizarEstado,
  eliminarRemesa,
  cargarRemesa,
  entregarRemesa,
  registrarNoEntrega,
  descargarRemesa
}
