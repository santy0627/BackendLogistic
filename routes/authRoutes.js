const express = require('express')
const router = express.Router()
const { registerUser, loginUser, getUsersByRole } = require('../controllers/authController')
const { registerValidator, loginValidator } = require('../validators/authValidator')
const validateMiddleware = require('../middlewares/validateMiddleware')
const authMiddleware = require('../middlewares/authMiddleware')

router.post('/register', registerValidator, validateMiddleware, registerUser)
router.post('/login', loginValidator, validateMiddleware, loginUser)
router.get('/users/:role', authMiddleware, validateMiddleware, getUsersByRole)

module.exports = router
