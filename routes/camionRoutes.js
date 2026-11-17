const express = require('express')
const router = express.Router()
const {
  crearCamion,
  desactivarCamion,
  obtenerCamiones,
  eliminarCamion,
  asignarRemesas,
  salirRuta,
  volverRuta
} = require('../controllers/camionController')
const { camionValidator } = require('../validators/camionValidator')
const { idParam } = require('../validators/idValidator')
const authMiddleware = require('../middlewares/authMiddleware')
const authRole = require('../middlewares/roleAuthMiddleware')
const validateMiddleware = require('../middlewares/validateMiddleware')

router.post(
  '/camion',
  authMiddleware,
  authRole('admin'),
  camionValidator,
  validateMiddleware,
  crearCamion
)
router.put(
  '/camion/:id',
  authMiddleware,
  authRole('admin'),
  idParam('id'),
  validateMiddleware,
  desactivarCamion
)
router.get('/camion', authMiddleware, validateMiddleware, obtenerCamiones)
router.delete(
  '/camion/:id',
  authMiddleware,
  authRole('admin'),
  idParam('id'),
  validateMiddleware,
  eliminarCamion
)
router.put(
  '/camion/:id/remesas',
  authMiddleware,
  authRole('admin'),
  idParam('id'),
  validateMiddleware,
  asignarRemesas
)
router.put(
  '/camion/:id/salir',
  authMiddleware,
  authRole('conductor'),
  idParam('id'),
  validateMiddleware,
  salirRuta
)
router.put(
  '/camion/:id/volver',
  authMiddleware,
  authRole('conductor'),
  idParam('id'),
  validateMiddleware,
  volverRuta
)

module.exports = router
