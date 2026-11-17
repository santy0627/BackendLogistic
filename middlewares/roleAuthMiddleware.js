// Acepta uno o varios roles: authRole('admin') o authRole('auxiliar', 'admin')
const authRole = (...roles) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        msg: 'No hay usuario autenticado'
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        msg: `Se requiere uno de estos roles: ${roles.join(', ')}`
      })
    }

    next()
  }
}

module.exports = authRole
