import express from 'express'
import { PORT } from './config/config.js'
import { connectDB } from './config/db.js'
import productRouter from "./routes/productRoutes.js"

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
connectDB()

app.use("/api/product", productRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})