const { body } = require('express-validator')
const { ciudades, datosCiudades } = require('../constants/ciudades')
const Remesa = require('../models/remesaSchema')

const tiposMercancia = Remesa.schema.path('tipoMercancia').enumValues
const estados = Remesa.schema.path('estado').enumValues

const remesaValidator = [
  body('codigo')
    .notEmpty()
    .withMessage('El código es obligatorio')
    .isInt({ min: 10000000 })
    .withMessage('El código debe ser numérico y tener mínimo 8 dígitos'),
  body('cantidad')
    .notEmpty()
    .withMessage('La cantidad es obligatoria')
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser un entero mayor a 0'),
  body('pesoTotal')
    .notEmpty()
    .withMessage('El peso total es obligatorio')
    .isFloat({ gt: 0 })
    .withMessage('El peso total debe ser un número mayor a 0'),
  body('direccionDestino')
    .trim()
    .notEmpty()
    .withMessage('La dirección de destino es obligatoria'),
  body('ciudadDestino')
    .notEmpty()
    .withMessage('La ciudad de destino es obligatoria')
    .isIn(ciudades)
    .withMessage('La ciudad de destino no es válida'),
  body('barrioDestino')
    .trim()
    .notEmpty()
    .withMessage('El barrio de destino es obligatorio')
    .custom((barrio, { req }) => {
      const ciudad = req.body.ciudadDestino
      if (!Object.hasOwn(datosCiudades, ciudad)) return true
      if (!Object.hasOwn(datosCiudades[ciudad].barrios, barrio)) {
        throw new Error(`El barrio "${barrio}" no existe en ${ciudad}`)
      }
      return true
    }),
  body('tipoMercancia')
    .notEmpty()
    .withMessage('El tipo de mercancía es obligatorio')
    .isIn(tiposMercancia)
    .withMessage(`El tipo de mercancía debe ser: ${tiposMercancia.join(', ')}`),
  body('remitente').trim().notEmpty().withMessage('El remitente es obligatorio'),
  body('destinatario').trim().notEmpty().withMessage('El destinatario es obligatorio'),
  body('ciudadOrigen')
    .notEmpty()
    .withMessage('La ciudad de origen es obligatoria')
    .isIn(ciudades)
    .withMessage('La ciudad de origen no es válida')
]

const remesaActualizarValidator = [
  body('estado')
    .notEmpty()
    .withMessage('El estado es obligatorio')
    .isIn(estados)
    .withMessage(`El estado debe ser uno de: ${estados.join(', ')}`)
]

const noEntregaValidator = [
  body('motivoNoEntrega')
    .trim()
    .notEmpty()
    .withMessage('El motivo de la no entrega es obligatorio')
    .isLength({ max: 500 })
    .withMessage('El motivo no puede superar los 500 caracteres')
]

module.exports = { remesaValidator, remesaActualizarValidator, noEntregaValidator }
