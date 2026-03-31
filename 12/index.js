import express from "express"
import cors from "cors"
import { PORT, SECRET } from "./src/config/config.js"
import { connectDB } from "./src/config/db.js"
import productRoute from "./src/routes/productRoute.js"
import categoryRoute from "./src/routes/categoryRoute.js"
import userRoute from "./src/routes/userRoute.js"
import purchaseRoute from "./src/routes/purchaseRoute.js"

const app = express()

// Habilitar CORS para permitir peticiones desde el frontend (Vite) de forma segura
app.use(cors({
    origin: '*', // Puerto en el que corre React
    credentials: true // Permite envío de cookies/headers de sesión autorizada
}))

app.use(express.json())

app.use(express.urlencoded({extended: true}))

// Solo conectamos a la BD y levantamos el server si NO estamos en entorno de test
if (process.env.NODE_ENV !== 'test') {
    connectDB()
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`)
    })
}

// Rutas
// Agrupador de rutas de productos
app.use("/api/product", productRoute)
app.use("/api/category", categoryRoute)
app.use("/api/user", userRoute)
app.use("/api/purchase", purchaseRoute)

export default app