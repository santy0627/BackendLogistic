const Remesa = require('../models/remesaSchema')

const crearRemesa = async (req, res) => {
    try {
        const { codigo, cantidad, pesoTotal, direccionEntrega, ciudadEntrega, tipoMercancia } = req.body
    
        let remesa = await Remesa.findOne({ codigo })

        if(remesa) {
            return res.status(400).json({
                msg: 'La remesa ya existe en la base de datos'
            })
        }

        remesa = new Remesa({
            codigo: codigo,
            cantidad: cantidad,
            pesoTotal: pesoTotal,
            direccionEntrega: direccionEntrega,
            ciudadEntrega: ciudadEntrega,
            tipoMercancia: tipoMercancia
        })

        await remesa.save()

        return res.status(201).json({
            msg: 'Remesa registrada exitosamente'
        })

    } catch(error) {
        return res.status(500).json({
            msg: `Error al registrar la remesa: ${error.message}`
        })
    }
}

const obtenerRemesas = async(res) => {
    try {
        const remesas = await Remesa.find()

        return res.status(200).json( remesas )
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
    } catch(error) {
        return res.status(500).json({
            msg: `Error al obtener las remesas por estado: ${error.message}`
        })
    }
}

const actualizarRemesa = async (req, res) => {
    try {

        const { estado } = req.body

        const remesa = await Remesa.findByIdAndUpdate(
            req.params.id,
            { estado },
            { new: true }
        )

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


module.exports = { crearRemesa, obtenerRemesas, obtenerRemesasPorEstado, actualizarRemesa }