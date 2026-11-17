const express = require('express')
const router = express.Router()
const {
  crearRemesa,
  obtenerRemesas,
  obtenerRemesasPorEstado,
  actualizarEstado,
  eliminarRemesa,
  cargarRemesa,
  entregarRemesa,
  registrarNoEntrega,
  descargarRemesa
} = require('../controllers/remesaController')
const {
  remesaValidator,
  remesaActualizarValidator,
  noEntregaValidator
} = require('../validators/remesaValidator')
const { idParam } = require('../validators/idValidator')
const validateMiddleware = require('../middlewares/validateMiddleware')
const authMiddleware = require('../middlewares/authMiddleware')
const authRole = require('../middlewares/roleAuthMiddleware')

router.post(
  '/remesas',
  authMiddleware,
  authRole('admin'),
  remesaValidator,
  validateMiddleware,
  crearRemesa
)
router.get('/remesas', authMiddleware, obtenerRemesas)
router.get('/remesas/:estado', authMiddleware, obtenerRemesasPorEstado)
router.delete(
  '/remesas/:id',
  authMiddleware,
  authRole('admin'),
  idParam('id'),
  validateMiddleware,
  eliminarRemesa
)

router.put(
  '/remesas/:remesaId/camion/:camionId/cargar',
  authMiddleware,
  authRole('auxiliar', 'admin'),
  idParam('remesaId', 'camionId'),
  validateMiddleware,
  cargarRemesa
)

router.put(
  '/remesas/:remesaId/entregar',
  authMiddleware,
  authRole('conductor'),
  idParam('remesaId'),
  validateMiddleware,
  entregarRemesa
)

router.put(
  '/remesas/:remesaId/no-entrega',
  authMiddleware,
  authRole('conductor'),
  idParam('remesaId'),
  noEntregaValidator,
  validateMiddleware,
  registrarNoEntrega
)

router.put(
  '/remesas/:remesaId/descargar',
  authMiddleware,
  authRole('auxiliar', 'admin'),
  idParam('remesaId'),
  validateMiddleware,
  descargarRemesa
)

router.put(
  '/remesas/:id',
  authMiddleware,
  idParam('id'),
  remesaActualizarValidator,
  validateMiddleware,
  actualizarEstado
)

module.exports = router
