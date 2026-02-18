import express from 'express'
import { PORT } from './config/config.js'
import { testConnection } from './config/db.js'
import estudiantesRoutes from './routes/estudiantesRoutes.js'
import cors from 'cors'

const app = express()

// Middlewares - software del medio

// Parsea el body cuando viene como json
app.use(express.json())

// Parsea el body cuando viene como form-urlencoded
app.use(express.urlencoded({ extended: true }))

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"]
}))

// ACA ESCRIBI TU CODIGO

// ruta de ejemplo
app.get("/", (req, res) => {
    res.json({
        endpoints: {
            "POST /estudiantes": "Crear estudiante",
            "GET /estudiantes": "Traer estudiantes",
            "PATCH /estudiantes/:id": "Editar estudiante",
            "DELETE /estudiantes/:id": "Borrar estudiante"
        }
    })
})

// Establecemos el endpoint base de los estudiantes
app.use("/api/estudiantes", estudiantesRoutes)

app.listen(PORT, async () => {
    console.log(`Servidor corriendo en el puerto: ${PORT}`)
    await testConnection()
})