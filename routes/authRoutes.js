    const express = require('express')
    const router = express.Router()
    const { registerUser } = require('../controllers/authController')
    const { registerValidator } = require('../validators/authValidator')
    const validateMiddleware = require('../middlewares/validateMiddleware')

    router.post('/register', validateMiddleware, registerValidator, registerUser)

    module.exports = router