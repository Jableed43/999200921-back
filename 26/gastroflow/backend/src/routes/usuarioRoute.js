import express from 'express'
import {
    register,
    registerAdmin,
    login,
    getAllUsuario,
    getUsuarioById,
    updateUsuario,
    deleteUsuario,
} from '../controllers/usuarioController.js'
import { verifyTokenMiddleware } from '../middlewares/verifyTokenMiddleware.js'
import { verifyRoleMiddleware } from '../middlewares/verifyRoleMiddleware.js'
import { roleEnum } from '../models/usuarioModel.js'

const usuarioRoute = express.Router()

// ── Rutas públicas (sin token) ─────────────────────────────────────────────
usuarioRoute.post('/register', register)
usuarioRoute.post('/login', login)

// ── Rutas protegidas ───────────────────────────────────────────────────────
// Solo ADMIN puede crear usuarios con rol específico (ej: otro ADMIN o un CHEF)
usuarioRoute.post(
    '/register-admin',
    verifyTokenMiddleware,
    verifyRoleMiddleware([roleEnum[0]]), // ADMIN
    registerAdmin
)

// Solo ADMIN ve la lista completa de usuarios
usuarioRoute.get(
    '/',
    verifyTokenMiddleware,
    verifyRoleMiddleware([roleEnum[0]]), // ADMIN
    getAllUsuario
)

// ADMIN o el propio usuario pueden ver el perfil
usuarioRoute.get('/:id', verifyTokenMiddleware, getUsuarioById)

// ADMIN o el propio usuario pueden editar
usuarioRoute.patch('/:id', verifyTokenMiddleware, updateUsuario)
usuarioRoute.put('/:id', verifyTokenMiddleware, updateUsuario)

// Solo ADMIN puede desactivar usuarios
usuarioRoute.delete(
    '/:id',
    verifyTokenMiddleware,
    verifyRoleMiddleware([roleEnum[0]]), // ADMIN
    deleteUsuario
)

export default usuarioRoute
