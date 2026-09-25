const { body } = require('express-validator')

const camionValidator = [
    body('placa')
        .notEmpty().withMessage('La placa es obligatoria')
        .isLength({ min: 6, max: 6 }).withMessage('La placa debe tener exactamente 6 caracteres, 3 letras y 3 números'),
    body('capacidadCarga')
        .notEmpty().withMessage('La capacidad de carga es obligatoria')
        .isNumeric().withMessage('La capacidad de carga debe ser un número')
]

module.exports = { camionValidator }