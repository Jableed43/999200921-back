import express from 'express'
import { PORT } from './config/config.js'
import { testConnection } from './config/db.js'
import estudiantesRoutes from './routes/estudiantesRoutes.js'

const app = express()

// Middlewares - software del medio

// Parsea el body cuando viene como json
app.use(express.json())

// Parsea el body cuando viene como form-urlencoded
app.use(express.urlencoded({ extended: true }))

// ACA ESCRIBI TU CODIGO

// ruta de ejemplo
app.get("/", (req, res) => {
    res.json({
        endpoints: {
            "POST /estudiantes": "Crear estudiante"
        }
    })
})

// Establecemos el endpoint base de los estudiantes
app.use("/api/estudiantes", estudiantesRoutes)

app.listen(PORT, async () => {
    console.log(`Servidor corriendo en el puerto: ${PORT}`)
    await testConnection()
})