const mongoose = require('mongoose')

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Conectado a la base de datos')
    } catch (error) {
        console.error('Error al conectar a la base de datos mongoDB:', error)
    }
}

module.exports = dbConnection