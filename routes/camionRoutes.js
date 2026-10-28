const express = require('express')
const router = express.Router()
const { crearCamion, actualizarCamion, obtenerCamiones, eliminarCamion, asignarRemesas } = require('../controllers/camionController')
const { camionValidator } = require('../validators/camionValidator')
const authMiddleware = require('../middlewares/authMiddleware')
const authRole = require('../middlewares/roleAuthMiddleware')
const validateMiddleware = require('../middlewares/validateMiddleware')

router.post('/camion', authMiddleware, authRole('admin'), camionValidator, validateMiddleware, crearCamion)
router.put('/camion/:id', authMiddleware, authRole('admin'), validateMiddleware, actualizarCamion)
router.get('/camion', authMiddleware, validateMiddleware, obtenerCamiones)
router.delete('/camion/:id', authMiddleware, authRole('admin'), validateMiddleware, eliminarCamion)
router.put('/camion/:id/remesas', authMiddleware, authRole('admin'), validateMiddleware, asignarRemesas)

module.exports = router