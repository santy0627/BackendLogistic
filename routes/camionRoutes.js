const express = require('express')
const router = express.Router()
const { crearCamion, actualizarCamion } = require('../controllers/camionController')
const { camionValidator } = require('../validators/camionValidator')
const authMiddleware = require('../middlewares/authMiddleware')
const authRole = require('../middlewares/roleAuthMiddleware')
const validateMiddleware = require('../middlewares/validateMiddleware')

router.post('/camion', authMiddleware, authRole('admin'), camionValidator, validateMiddleware, crearCamion)
router.put('/camion', authMiddleware, validateMiddleware, actualizarCamion)

module.exports = router