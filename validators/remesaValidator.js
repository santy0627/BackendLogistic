const { body } = require('express-validator')

const remesaValidator = [
    body('codigo')
        .notEmpty().withMessage('El código es obligatorio')
        .isLength({ min: 8 }).withMessage('Código requiere mínimo 8 caracteres'),
    body('cantidad')
        .notEmpty().withMessage('La cantidad es obligatoria')
        .isNumeric().withMessage('La cantidad debe ser un número'),
    body('pesoTotal')
        .notEmpty().withMessage('El peso total es obligatorio')
        .isNumeric().withMessage('El peso total debe ser un número'),
    body('direccionEntrega')
        .notEmpty().withMessage('La dirección de entrega es obligatoria'),
    body('ciudadEntrega')
        .notEmpty().withMessage('La ciudad de entrega es obligatoria'),
    body('tipoMercancia')
        .notEmpty().withMessage('El tipo de mercancía es obligatorio')
]

module.exports = {remesaValidator}