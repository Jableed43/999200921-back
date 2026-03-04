import express from 'express'
import { PORT } from './src/config/config.js'
import { connectDB } from './src/config/db.js'
import productRouter from "./src/routes/productRoutes.js"
import categoryRouter from './src/routes/categoryRoutes.js'
import userRouter from './src/routes/userRoutes.js'
import cors from 'cors'
import session from 'express-session'
import purchaseRouter from './src/routes/purchaseRoutes.js'

const app = express()

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
}))

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(session({
    secret: "secret",
    resave: false, // Evita que la session se vuelva a guardar si no hay datos
    saveUninitialized: false, // Evita que la sesion se guarde si no esta inicializada
}))

connectDB()

app.use("/api/product", productRouter)
app.use("/api/category", categoryRouter)
app.use("/api/user", userRouter)
app.use("/api/purchase", purchaseRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})