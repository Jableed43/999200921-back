import express from 'express'
import { 
    createVenta, 
    getAllVenta, 
    prepararPedido, 
    entregarPedido 
} from '../controllers/ventaController.js'
import { verifyTokenMiddleware } from '../middlewares/verifyTokenMiddleware.js'
import { verifyRoleMiddleware } from '../middlewares/verifyRoleMiddleware.js'
import { roleEnum } from '../models/usuarioModel.js'

const ventaRoute = express.Router()

// MOZO y ADMIN pueden crear comandas
ventaRoute.post('/', 
    verifyTokenMiddleware, 
    verifyRoleMiddleware([roleEnum[0], roleEnum[2]]), 
    createVenta
)

// CHEF y ADMIN pueden marcar como LISTO
ventaRoute.patch('/:id/listo', 
    verifyTokenMiddleware, 
    verifyRoleMiddleware([roleEnum[0], roleEnum[1]]), 
    prepararPedido
)

// MOZO, CHEF y ADMIN pueden marcar como ENTREGADO
ventaRoute.patch('/:id/entregar', 
    verifyTokenMiddleware, 
    verifyRoleMiddleware([roleEnum[0], roleEnum[1], roleEnum[2]]), 
    entregarPedido
)

// ADMIN y CHEF pueden ver el historial completo y estados
ventaRoute.get('/', 
    verifyTokenMiddleware, 
    verifyRoleMiddleware([roleEnum[0], roleEnum[1]]), 
    getAllVenta
)

export default ventaRoute
