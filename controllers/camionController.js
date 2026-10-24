const Camion = require('../models/camionSchema')

const crearCamion = async (req, res) => {
    try {
        const { placa, capacidadCarga } = req.body

        let camion = await Camion.findOne({ placa })

        if(camion) {
            return res.status(400).json({
                msg: 'El camion ya existe en la base de datos'
            })
        }

        camion = new Camion({
            placa: placa,
            capacidadCarga: capacidadCarga
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


module.exports = { crearCamion, actualizarCamion }