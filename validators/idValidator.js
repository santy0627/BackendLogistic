const { param } = require('express-validator')

// idParam('id') o idParam('remesaId', 'camionId'): valida que cada parámetro de la URL sea un ObjectId de Mongo
const idParam = (...nombres) =>
  nombres.map((nombre) =>
    param(nombre).isMongoId().withMessage(`El parámetro ${nombre} no es un id válido`)
  )

module.exports = { idParam }
