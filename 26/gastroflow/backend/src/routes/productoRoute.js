import express from 'express'
import { createProducto, getAllProducto, getProductoById, updateProducto, deleteProducto } from '../controllers/productoController.js'
import { verifyTokenMiddleware } from '../middlewares/verifyTokenMiddleware.js'
import { verifyRoleMiddleware } from '../middlewares/verifyRoleMiddleware.js'
import { roleEnum } from '../models/usuarioModel.js'

const productoRoute = express.Router()

// Todos los roles autenticados pueden ver el menú (MOZO lo necesita para hacer pedidos)
productoRoute.get('/', verifyTokenMiddleware, getAllProducto)
productoRoute.get('/:id', verifyTokenMiddleware, getProductoById)

// Solo ADMIN puede crear, editar y eliminar productos del menú
productoRoute.post('/', verifyTokenMiddleware, verifyRoleMiddleware([roleEnum[0]]), createProducto)
productoRoute.patch('/:id', verifyTokenMiddleware, verifyRoleMiddleware([roleEnum[0]]), updateProducto)
productoRoute.put('/:id', verifyTokenMiddleware, verifyRoleMiddleware([roleEnum[0]]), updateProducto)
productoRoute.delete('/:id', verifyTokenMiddleware, verifyRoleMiddleware([roleEnum[0]]), deleteProducto)

export default productoRoute
