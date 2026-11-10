const { body } = require('express-validator')

const remesaValidator = [
  body('codigo')
    .notEmpty()
    .withMessage('El código es obligatorio')
    .isLength({ min: 8 })
    .withMessage('Código requiere mínimo 8 caracteres'),
  body('cantidad')
    .notEmpty()
    .withMessage('La cantidad es obligatoria')
    .isNumeric()
    .withMessage('La cantidad debe ser un número'),
  body('pesoTotal')
    .notEmpty()
    .withMessage('El peso total es obligatorio')
    .isNumeric()
    .withMessage('El peso total debe ser un número'),
  body('direccionDestino')
    .notEmpty()
    .withMessage('La dirección de destino es obligatoria'),
  body('ciudadDestino')
    .notEmpty()
    .withMessage('La ciudad de destino es obligatoria'),
  body('tipoMercancia')
    .notEmpty()
    .withMessage('El tipo de mercancía es obligatorio'),
  body('estado')
    .optional()
    .default('enBodega')
    .isIn(['enBodega', 'cargada', 'enTransito', 'entregado', 'asignada'])
    .withMessage('El estado debe ser uno de los valores válidos'),
  body('remitente')
    .notEmpty()
    .withMessage('El remitente es obligatorio'),
  body('destinatario')
    .notEmpty()
    .withMessage('El destinatario es obligatorio'),
  body('ciudadOrigen')
    .notEmpty()
    .withMessage('La ciudad de origen es obligatoria'),
  body('barrioDestino')
    .notEmpty()
    .withMessage('El barrio de destino es obligatorio')
]

const remesaActualizarValidator = [
  body('estado')
    .notEmpty()
    .withMessage('El estado es obligatorio')
    .isIn(['enBodega', 'cargada', 'enTransito', 'entregado', 'asignada'])
    .withMessage('El estado debe ser uno de los valores válidos')
]

module.exports = { remesaValidator, remesaActualizarValidator }
