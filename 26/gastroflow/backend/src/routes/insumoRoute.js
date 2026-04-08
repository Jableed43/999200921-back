import express from 'express'
import { createInsumo, getAllInsumo, getInsumoById, updateInsumo, deleteInsumo } from '../controllers/insumoController.js'
import { verifyTokenMiddleware } from '../middlewares/verifyTokenMiddleware.js'
import { verifyRoleMiddleware } from '../middlewares/verifyRoleMiddleware.js'
import { roleEnum } from '../models/usuarioModel.js'

const insumoRoute = express.Router()

// ADMIN y CHEF pueden ver los insumos y las alertas de stock
insumoRoute.get('/', verifyTokenMiddleware, verifyRoleMiddleware([roleEnum[0], roleEnum[1]]), getAllInsumo)
insumoRoute.get('/:id', verifyTokenMiddleware, verifyRoleMiddleware([roleEnum[0], roleEnum[1]]), getInsumoById)

// Solo ADMIN puede crear y eliminar insumos
insumoRoute.post('/', verifyTokenMiddleware, verifyRoleMiddleware([roleEnum[0]]), createInsumo)
insumoRoute.delete('/:id', verifyTokenMiddleware, verifyRoleMiddleware([roleEnum[0]]), deleteInsumo)

// ADMIN y CHEF pueden actualizar stock (ej: el chef repone insumos)
insumoRoute.patch('/:id', verifyTokenMiddleware, verifyRoleMiddleware([roleEnum[0], roleEnum[1]]), updateInsumo)
insumoRoute.put('/:id', verifyTokenMiddleware, verifyRoleMiddleware([roleEnum[0], roleEnum[1]]), updateInsumo)

export default insumoRoute
