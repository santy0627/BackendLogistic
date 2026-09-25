const authRole = (role) => {
    try {
        return async (req, res, next) => {
            console.log(req.user)
            if(!req.user) {
                return res.status(401).json({
                    msg: 'No hay usuario autenticado'
                })
            }

            if(req.user.role !== role) {
                return res.status(403).json({
                    msg: `El usuario no tiene el rol requerido: ${req.user.role}`
                })
            }

            next()
        }
    } catch (error) {
        return res.status(500).json({
            msg: `Error en la autorización: ${error.message}`
        })
    }
}

module.exports = authRole