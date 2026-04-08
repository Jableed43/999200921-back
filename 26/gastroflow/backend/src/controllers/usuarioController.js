import { generateToken } from '../middlewares/verifyTokenMiddleware.js'
import { roleEnum } from '../models/usuarioModel.js'
import {
    createUsuarioService,
    loginUsuarioService,
    getAllUsuarioService,
    getUsuarioByIdService,
    updateUsuarioService,
    deleteUsuarioService,
} from '../services/usuarioService.js'
import { handleError } from '../utils/errorHandler.js'

// POST /api/usuario/register — Registro público (siempre crea MOZO)
export const register = async (req, res) => {
    try {
        const userData = { ...req.body, role: roleEnum[2] } // fuerza MOZO
        const usuario = await createUsuarioService(userData)
        res.status(201).json({ message: 'Usuario registrado correctamente', usuario })
    } catch (error) {
        handleError(error, res)
    }
}

// POST /api/usuario/register-admin — Solo el ADMIN puede crear CHEFs y ADMINs
export const registerAdmin = async (req, res) => {
    try {
        const usuario = await createUsuarioService(req.body)
        res.status(201).json({ message: 'Usuario creado por admin', usuario })
    } catch (error) {
        handleError(error, res)
    }
}

// POST /api/usuario/login
export const login = async (req, res) => {
    try {
        const usuario = await loginUsuarioService(req.body)

        const token = generateToken({
            userId: usuario._id,
            email: usuario.email,
            role: usuario.role,
            nombre: usuario.nombre,
        })

        res.status(200).json({ message: '¡Bienvenido!', token, role: usuario.role })
    } catch (error) {
        handleError(error, res)
    }
}

// GET /api/usuario — Solo ADMIN
export const getAllUsuario = async (req, res) => {
    try {
        const usuarios = await getAllUsuarioService()
        res.status(200).json(usuarios)
    } catch (error) {
        handleError(error, res)
    }
}

// GET /api/usuario/:id — ADMIN o el propio usuario
export const getUsuarioById = async (req, res) => {
    try {
        const usuario = await getUsuarioByIdService(req.params.id)
        res.status(200).json(usuario)
    } catch (error) {
        handleError(error, res)
    }
}

// PATCH /api/usuario/:id — El propio usuario o ADMIN
export const updateUsuario = async (req, res) => {
    try {
        const { id } = req.params

        // Solo el propio usuario o un ADMIN puede editar
        if (String(req.user.userId) !== String(id) && req.user.role !== roleEnum[0]) {
            return res.status(403).json({ message: 'No autorizado: solo podés editar tu propio perfil' })
        }

        const updated = await updateUsuarioService(id, req.body)
        res.status(200).json(updated)
    } catch (error) {
        handleError(error, res)
    }
}

// DELETE /api/usuario/:id — Solo ADMIN
export const deleteUsuario = async (req, res) => {
    try {
        const result = await deleteUsuarioService(req.params.id)
        res.status(200).json(result)
    } catch (error) {
        handleError(error, res)
    }
}
