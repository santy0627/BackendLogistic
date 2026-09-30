const express = require('express')
const router = express.Router()
const { crearRemesa, obtenerRemesas, obtenerRemesasPorEstado, actualizarRemesa } = require('../controllers/remesaController')
const { remesaValidator, remesaActualizarValidator } = require('../validators/remesaValidator')
const validateMiddleware = require('../middlewares/validateMiddleware')
const authMiddleware = require('../middlewares/authMiddleware')
const authRole = require('../middlewares/roleAuthMiddleware')

router.post('/remesas', authMiddleware, authRole('admin'), remesaValidator, validateMiddleware, crearRemesa)
router.get('/remesas', authMiddleware, obtenerRemesas)
router.get('/remesas/:estado', authMiddleware, obtenerRemesasPorEstado)
router.put('/remesas/:id', authMiddleware, remesaActualizarValidator, validateMiddleware, actualizarRemesa)

module.exports = router