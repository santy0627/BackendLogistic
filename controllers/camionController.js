const Camion = require('../models/camionSchema');
const Remesa = require('../models/remesaSchema');
const { ordenarRemesas } = require('../utils/rutas');
const Viaje = require('../models/viajeSchema')

const obtenerCamiones = async (req, res) => {
  try {
    const camiones = await Camion.find()
      .populate('conductor', 'nombre')
      .populate('ruta')

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
      conductor,
      operativo,
      ubicacionActual,
      ciudadOperacion,
      ruta
    } = req.body

    let camion = await Camion.findOne({ placa })
    if(conductor) {
      const ocupado = await Camion.findOne({ conductor })
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
      conductor: conductor,
      operativo: operativo ?? true,
      ubicacionActual: ubicacionActual ?? 'enBodega',
      ciudadOperacion: ciudadOperacion,
      ruta: ruta
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

const desactivarCamion = async (req, res) => {
  try {

    const { operativo } = req.body

    const camion = await Camion.findById(req.params.id)

    if(!camion) {
      return res.status(400).json({
        msg: 'El camión no existe en base de datos'
      })
    }

    if (camion.ruta.length > 0 ) {
      return res.status(400).json({
        msg: 'No puedes desactivar un camión con remesas'
      })
    }

    await Camion.findByIdAndUpdate(req.params.id, { operativo }, { new: true })

    return res.status(200).json({
      msg: 'Disponibilidad del camión actualizada exitosamente'
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

    if(!camion.conductor?.equals(req.user._id)){
      return res.status(403).json({
        msg: 'Solo el conductor del camión puede realizar esta acción'
      })
    }
    
    if(camion.ubicacionActual !== 'enBodega'){
      return res.status(400).json({
        msg: 'El camión no está en la bodega'
      })
    }

    if(camion.ruta.length === 0 ) {
      return res.status(400).json({
        msg: 'El camion no tiene remesas asignadas'
      })
    }
    if(!camion.conductor) {
      return res.status(400).json({
        msg: 'El camión no tiene conductor asignado'
      })
    }

    const remesasPendientes = await Remesa.find({
      _id: { $in: camion.ruta },
      estado: { $ne: 'cargada' }
    }).select('codigo estado')

    if(remesasPendientes.length > 0){
      return res.status(400).json({
        msg: 'No puedes salir: hay remesas que aún no están cargadas',
        remesasPendientes
      })
    }

    const paradas = camion.ruta.map((remesaId, i) => ({
      remesa: remesaId,
      orden: i + 1
    }))

    const viaje = await Viaje.create({
      camion: camion._id,
      placa: camion.placa,
      conductor: camion.conductor,
      paradas,
      fechaEntrega: new Date()
    })

    await Remesa.updateMany(
      { _id: { $in: camion.ruta} },
      { $set: { estado: 'enTransito'} }
    )
    
    camion.ubicacionActual = 'enRuta'

    await camion.save()

    return res.status(200).json({
      msg: 'Ubicación del camión actualizada exitosamente',
      viaje
    })
  } catch (error) {
    return res.status(500).json({
      msg: `Error al salir a ruta: ${error.message}`
    })
  }
}

const eliminarCamion = async (req, res) => {
  try {
    const camion = await Camion.findById(req.params.id)

    if (!camion){
      return res.status(404).json({
        msg: 'El camión no existe'
      })
    }


    if (camion.ruta.length > 0) {
      return res.status(400).json({
        msg: 'No puedes eliminar con remesas asignadas o cargadas'
      })
    }

    if (camion.ubicacionActual === 'enRuta') {
      return res.status(400).json({
        msg: 'No puedes eliminar un camión en ruta'
      })
    }

    await Camion.findByIdAndDelete(camion._id)

    return res.status(200).json({ msg: 'Camion eliminado' })
  } catch (error) {
    return res.status(404).json({
      msg: ` Error eliminando camion: ${error.message}`
    })
  }
}

const asignarRemesas = async (req, res) => {
  try {
    const { id } = req.params

    const camion = await Camion.findById(id)

    //verificaciones
    if (!camion) {
      return res.status(404).json({
        msg: 'El camion no existe en la base de datos'
      })
    }

    if(camion.operativo === false) {
      return res.status(400).json({
        msg: 'El camión no está disponible para asignar remesas'
      })
    }

    if(camion.ruta.length > 0) {
      return res.status(400).json({
        msg: 'El camión ya tiene remesas asignadas'
      })
    }

    if(camion.ubicacionActual === 'enRuta'){
      return res.status(400).json({
        msg: 'El camión ya está en ruta'
      })
    }

    const remesasDisponibles = await Remesa.find({ // remesas dentro del area de operacion
      ciudadDestino: camion.ciudadOperacion,
      estado: 'enBodega'
    }).sort({ createdAt: 1, _id: 1 })

    const remesasSeleccionadas = []
    let pesoAcumulado = 0

    for (const remesa of remesasDisponibles) {
      if (pesoAcumulado + remesa.pesoTotal <= camion.capacidadCarga) {
        pesoAcumulado += remesa.pesoTotal
        remesasSeleccionadas.push(remesa)
      }
    }

    if (remesasSeleccionadas.length === 0) {
      return res.status(400).json({
        msg: 'Ninguna remesa cabe en la capacidad del camión'
      })
    }

    const remesasOrdenadas = ordenarRemesas( // ordenar remesas
      camion.ciudadOperacion,
      remesasSeleccionadas
    )

    const remesasACargar = remesasOrdenadas.map(remesa => remesa._id)

    camion.ruta = remesasACargar

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

const volverRuta = async (req, res) => {
  try {
    const { id } = req.params

    const camion = await Camion.findById(id)

    if(!camion) {
      return res.status(404).json({
        msg: 'El camión no existe en base de datos'
      })
    }

    if(!camion.conductor?.equals(req.user._id)){
      return res.status(403).json({
        msg: 'Solo el conductor del camión puede realizar esta acción'
      })
    }

    if(camion.ubicacionActual !== 'enRuta'){
      return res.status(400).json({
        msg: 'El camión ya está en bodega'
      })
    }

    const viaje = await Viaje.findOne({
      camion: camion._id,
      estado: 'enCurso'
    })

    if(!viaje){
      return res.status(409).json({
        msg: 'El camión no tiene una ruta creada'
      })
    }

    const remesas = await Remesa.find({ _id: { $in: camion.ruta } })

    const remesasPendientes = remesas.filter(
      (remesa) => !['entregado', 'noEntregada'].includes(remesa.estado)
    )

    if(remesasPendientes.length > 0){
      return res.status(400).json({
        msg: 'Aún tienes remesas sin reportar',
        remesasPendientes: remesasPendientes.map((r) => ({ codigo: r.codigo, estado: r.estado }))
      })
    }

    const porId = new Map(remesas.map((r) => [r._id.toString(), r]))

    for (const parada of viaje.paradas) {
      const remesa = porId.get(parada.remesa.toString())
      parada.resultado = remesa.estado
      parada.motivoNoEntrega = remesa.motivoNoEntrega
    }

    viaje.estado = 'finalizado'
    viaje.horaRegreso = new Date()
    await viaje.save()

    const idsEntregadas = remesas
      .filter((remesa) => remesa.estado === 'entregado')
      .map((remesa) => remesa._id)

    await Camion.updateOne(
      { _id: camion._id },
      { $pull: { ruta: { $in: idsEntregadas } }, $set: { ubicacionActual: 'enBodega' } }
    )

    return res.status(200).json({
      msg: 'Camión de vuelta a bodega y viaje actualizado'
    })

  } catch (error) {
    return res.status(500).json({
      msg: `Error voliendo de ruta: ${error.message}`
    })
  }
}

module.exports = {
  crearCamion,
  desactivarCamion,
  obtenerCamiones,
  eliminarCamion,
  asignarRemesas,
  salirRuta,
  volverRuta
}
