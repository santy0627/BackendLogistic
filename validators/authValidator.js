const { body } = require('express-validator')

const registerValidator = [
    body('nombre')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 3 }).withMessage('Nombre requiere mínimo 3 caracteres'),
    body('email')
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('Debes enviar un email válido'),
    body('password')
        .notEmpty().withMessage('El password es obligatorio')
        .isStrongPassword().withMessage('La contraseña debe tener mínimo 8 caracteres, mayúsculas, minúsculas, números y caracteres especiales'),
    body('role')
        .notEmpty().withMessage('El rol es obligatorio')
        .isIn(['admin', 'auxiliar', 'conductor']).withMessage('El rol debe ser admin, auxiliar o conductor')
]

module.exports = {registerValidator}