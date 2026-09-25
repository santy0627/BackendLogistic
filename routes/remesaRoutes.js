const express = require('express')
const router = express.Router()
const { crearRemesa, obtenerRemesas, obtenerRemesasPorEstado, actualizarRemesa } = require('../controllers/remesaController')
const { remesaValidator } = require('../validators/remesaValidator')
const validateMiddleware = require('../middlewares/validateMiddleware')
const authMiddleware = require('../middlewares/authMiddleware')
const authRole = require('../middlewares/roleAuthMiddleware')

router.post('/remesa', authMiddleware, authRole('admin'), validateMiddleware, remesaValidator, crearRemesa)
router.get('/remesas', authMiddleware, obtenerRemesas)
router.get('/remesas/:estado', authMiddleware, obtenerRemesasPorEstado)
router.put('/remesa/:id', authMiddleware, remesaValidator, actualizarRemesa)

module.exports = router