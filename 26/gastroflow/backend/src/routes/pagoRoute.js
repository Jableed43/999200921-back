import express from 'express'
import { generarQR, consultarEstadoPago } from '../controllers/pagoController.js'
import { verifyTokenMiddleware } from '../middlewares/verifyTokenMiddleware.js'

const pagoRoute = express.Router()

// Generar QR de Mercado Pago para una venta
pagoRoute.post('/:ventaId/qr', verifyTokenMiddleware, generarQR)

// Consultar estado del pago
pagoRoute.get('/:ventaId/status', verifyTokenMiddleware, consultarEstadoPago)

export default pagoRoute
