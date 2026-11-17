const { body } = require('express-validator')
const { ciudades } = require('../constants/ciudades')
const Camion = require('../models/camionSchema')

const ubicaciones = Camion.schema.path('ubicacionActual').enumValues

const camionValidator = [
  body('placa')
    .trim()
    .toUpperCase()
    .notEmpty()
    .withMessage('La placa es obligatoria')
    .matches(/^[A-Z]{3}\d{3}$/)
    .withMessage('La placa debe tener 3 letras y 3 números, por ejemplo ABC123'),
  body('capacidadCarga')
    .notEmpty()
    .withMessage('La capacidad de carga es obligatoria')
    .isFloat({ gt: 0 })
    .withMessage('La capacidad de carga debe ser un número mayor a 0'),
  body('operativo').optional().isBoolean().withMessage('operativo debe ser true o false'),
  body('ubicacionActual')
    .optional()
    .isIn(ubicaciones)
    .withMessage(`La ubicación debe ser: ${ubicaciones.join(' o ')}`),
  body('conductor')
    .notEmpty()
    .withMessage('El conductor es obligatorio')
    .isMongoId()
    .withMessage('El conductor debe ser un id válido'),
  body('ciudadOperacion')
    .notEmpty()
    .withMessage('La ciudad de operación es obligatoria')
    .isIn(ciudades)
    .withMessage('La ciudad de operación no es válida'),
  body('ruta').optional().isArray().withMessage('La ruta debe ser un arreglo de remesas'),
  body('ruta.*').isMongoId().withMessage('Cada remesa de la ruta debe ser un id válido')
]

module.exports = { camionValidator }
