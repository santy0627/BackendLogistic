const Camion = require('../models/camionSchema')

const obtenerCamiones = async (req, res) => {
    try {
        const camiones = await Camion.find().populate('conductorAsignado', 'nombre')

        return res.status(200).json( camiones )
    } catch (error){
        return res.status(500).json({
            msg: `Error al obtener los camiones: ${error.message}`
        })
    }
}

const crearCamion = async (req, res) => {
    try {
        const { placa, capacidadCarga, conductorAsignado, disponible, ubicacionActual } = req.body

        let camion = await Camion.findOne({ placa })

        if(camion) {
            return res.status(400).json({
                msg: 'El camion ya existe en la base de datos'
            })
        }

        camion = new Camion({
            placa: placa,
            capacidadCarga: capacidadCarga,
            conductorAsignado: conductorAsignado || null,
            disponible: disponible ?? true,
            ubicacionActual: ubicacionActual ?? 'bodega'
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

        const camion = await Camion.findByIdAndUpdate(
            req.params.id,
            { disponible },
            { new: true }
        )

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

const eliminarCamion = async (req, res) => {
    try {

        await Camion.findByIdAndDelete(req.params.id)

        res.status(200).json({ msg: 'Camion eliminada' })

    } catch (error) {
        return res.status(500).json({
            msg:` Error eliminando camion: ${error.message}`
        })
    }
}

module.exports = { crearCamion, actualizarCamion, obtenerCamiones, eliminarCamion }