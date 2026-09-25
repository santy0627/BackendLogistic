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


module.exports = { crearCamion }