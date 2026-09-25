const express = require('express')
const app = express();
const dotenv = require('dotenv')
const auth = require('./routes/authRoutes')
const remesa = require('./routes/remesaRoutes')
const camion = require('./routes/camionRoutes')

dotenv.config()
const dbConnection = require('./config/db')

dbConnection()

app.use(express.json())

app.use('/api/auth', auth)
app.use('/api', remesa)
app.use('/api', camion)


const PORT = process.env.PORT

app.listen(PORT, () => {
    try{
        console.log(`Conectado al puerto ${PORT}`)
    } catch(error) {
        console.error('Error conectandose a node:', error)
    }
})