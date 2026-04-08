import { 
    createVentaService, 
    getAllVentaService, 
    prepararPedidoService, 
    entregarPedidoService 
} from '../services/ventaService.js'
import { handleError } from '../utils/errorHandler.js'

export const createVenta = async (req, res) => {
    try {
        const { items } = req.body
        const mozoId = req.user.userId // Obtenido del token JWT
        
        const venta = await createVentaService(items, mozoId)
        res.status(201).json({ 
            message: 'Comanda creada y stock reservado correctamente', 
            venta 
        })
    } catch (error) {
        handleError(error, res)
    }
}

// CHEF marca como listo
export const prepararPedido = async (req, res) => {
    try {
        const { id } = req.params
        const venta = await prepararPedidoService(id)
        res.status(200).json({ 
            message: 'Pedido listo para retirar. Stock físico descontado.', 
            venta 
        })
    } catch (error) {
        handleError(error, res)
    }
}

// MOZO marca como entregado
export const entregarPedido = async (req, res) => {
    try {
        const { id } = req.params
        const venta = await entregarPedidoService(id)
        res.status(200).json({ 
            message: 'Pedido entregado en mesa con éxito', 
            venta 
        })
    } catch (error) {
        handleError(error, res)
    }
}

export const getAllVenta = async (req, res) => {
    try {
        const ventas = await getAllVentaService(req.query)
        res.status(200).json(ventas)
    } catch (error) {
        handleError(error, res)
    }
}
