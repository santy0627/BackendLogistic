const express = require('express')
const app = express();
const dotenv = require('dotenv')
const auth = require('./routes/authRoutes')

dotenv.config()
const dbConnection = require('./config/db')

dbConnection()

app.use(express.json())

app.use('/api/auth', auth)

const PORT = process.env.PORT

app.listen(PORT, () => {
    try{
        console.log(`Conectado al puerto ${PORT}`)
    } catch(error) {
        console.error('Error conectandose a node:', error)
    }
})