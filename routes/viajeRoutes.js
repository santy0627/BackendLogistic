const express = require('express')
const router = express.Router()
const { obtenerViajes } = require('../controllers/viajeController')
const authMiddleware = require('../middlewares/authMiddleware')
const authRole = require('../middlewares/roleAuthMiddleware')
const validateMiddleware = require('../middlewares/validateMiddleware')

router.get('/viajes', authMiddleware, authRole('admin'), validateMiddleware, obtenerViajes)

module.exports = router
