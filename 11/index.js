import express from 'express'
import { PORT } from './config/config.js'
import { testConnection } from './config/db.js'

const app = express()

// Middlewares - software del medio

// Parsea el body cuando viene como json
app.use(express.json())

// Parsea el body cuando viene como form-urlencoded
app.use(express.urlencoded({ extended: true }))

app.listen(PORT, async () => {
    console.log(`Servidor corriendo en el puerto: ${PORT}`)
    await testConnection()
})