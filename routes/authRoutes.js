const express = require('express')
const router = express.Router()
const { registerUser, loginUser } = require('../controllers/authController')
const { registerValidator, loginValidator } = require('../validators/authValidator')
const validateMiddleware = require('../middlewares/validateMiddleware')

router.post('/register', registerValidator, validateMiddleware, registerUser)
router.post('/login', loginValidator, validateMiddleware, loginUser)

module.exports = router