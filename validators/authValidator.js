const { body } = require('express-validator')
const User = require('../models/userSchema')

const roles = User.schema.path('role').enumValues

const registerValidator = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ min: 3 })
    .withMessage('Nombre requiere mínimo 3 caracteres'),
  body('cedula')
    .notEmpty()
    .withMessage('La cédula es obligatoria')
    .matches(/^\d{6,10}$/)
    .withMessage('La cédula debe tener entre 6 y 10 dígitos, solo números'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es obligatorio')
    .isEmail()
    .withMessage('Debes enviar un email válido'),
  body('password')
    .notEmpty()
    .withMessage('El password es obligatorio')
    .isStrongPassword()
    .withMessage(
      'La contraseña debe tener mínimo 8 caracteres, mayúsculas, minúsculas, números y caracteres especiales'
    ),
  body('role')
    .notEmpty()
    .withMessage('El rol es obligatorio')
    .isIn(roles)
    .withMessage(`El rol debe ser uno de: ${roles.join(', ')}`)
]

const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es obligatorio')
    .isEmail()
    .withMessage('Debes enviar un email válido'),
  body('password').notEmpty().withMessage('El password es obligatorio')
]

module.exports = { registerValidator, loginValidator }
