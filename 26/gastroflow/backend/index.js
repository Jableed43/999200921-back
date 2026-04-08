import express from 'express'
import cors from 'cors'
import { PORT } from './src/config/config.js'
import { connectDB } from './src/config/db.js'
import insumoRoute from './src/routes/insumoRoute.js'
import productoRoute from './src/routes/productoRoute.js'
import ventaRoute from './src/routes/ventaRoute.js'
import dashboardRoute from './src/routes/dashboardRoute.js'
import usuarioRoute from './src/routes/usuarioRoute.js'

const app = express()

app.use(cors({ origin: '*', credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if (process.env.NODE_ENV !== 'test') {
    connectDB()
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
    })
}

app.use('/api/insumo', insumoRoute)
app.use('/api/producto', productoRoute)
app.use('/api/venta', ventaRoute)
app.use('/api/dashboard', dashboardRoute)
app.use('/api/usuario', usuarioRoute)

export default app
