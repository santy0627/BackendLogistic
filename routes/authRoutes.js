const express = require('express')
const router = express.Router()
const { registerUser, loginUser } = require('../controllers/authController')
const { registerValidator } = require('../validators/authValidator')
const validateMiddleware = require('../middlewares/validateMiddleware')

router.post('/register', validateMiddleware, registerValidator, registerUser)
router.post('/login', loginUser)

module.exports = router