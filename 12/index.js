import express from 'express'
import { PORT } from './src/config/config.js'
import { connectDB } from './src/config/db.js'
import productRouter from "./src/routes/productRoutes.js"
import categoryRouter from './src/routes/categoryRoutes.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
connectDB()

app.use("/api/product", productRouter)
app.use("/api/category", categoryRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})