const jwt = require('jsonwebtoken')
const User = require('../models/userSchema')

module.exports = async (req, res, next) => {
    try {
        const headerAuth = req.header('Authorization')
        const token = headerAuth.split(' ')[1]

        if(!token){
            return res.status(401).json({
                msg: 'No hay token en la petición'
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const user = await User.findById(decoded.id)
        req.user = user
        next()

    } catch(error) {
        return res.status(500).json({
            msg: `Token invalido: ${error.message}`
        })
    }
}