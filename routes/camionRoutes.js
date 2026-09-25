const express = require('express')
const router = express.Router()
const { crearCamion } = require('../controllers/camionController')
const { camionValidator } = require('../validators/camionValidator')
const authMiddleware = require('../middlewares/authMiddleware')
const authRole = require('../middlewares/roleAuthMiddleware')

router.post('/camion', authMiddleware, authRole('admin'), camionValidator, crearCamion)

module.exports = router