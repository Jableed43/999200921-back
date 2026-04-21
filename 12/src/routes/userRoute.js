import express from 'express'
import { createUser, createUserAdmin, deleteUser, getUser, updateUser, validateUser } from '../controllers/userController.js'
import { verifyTokenMiddleware } from '../middlewares/verifyTokenMiddleware.js'
import { verifyRoleMiddleware } from '../middlewares/verifyRoleMiddleware.js'
import { roleEnum } from '../models/userModel.js'
import upload from '../middlewares/multerMiddleware.js'

const userRoute = express.Router()

// ── Rutas públicas (sin token) ─────────────────────────────────────────────
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints de gestión de usuarios
 */

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Registrar un nuevo usuario (cliente)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - lastName
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               lastName:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado
 */
userRoute.post("/register", createUser)


/**
 * @swagger
 * /api/user:
 *   post:
 *     summary: Crear un nuevo usuario administrador (Solo ADMIN)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - lastName
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               lastName:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [ADMIN, CHEF, CLIENT]
 *     responses:
 *       201:
 *         description: Usuario admin creado
 *       403:
 *         description: Permisos insuficientes
 */
userRoute.post("/", verifyTokenMiddleware, verifyRoleMiddleware([roleEnum[0]]), createUserAdmin)

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Obtener lista de todos los usuarios (Solo ADMIN)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente
 *       401:
 *         description: Token no provisto o inválido
 */
userRoute.get("/", verifyTokenMiddleware, verifyRoleMiddleware([roleEnum[0]]), getUser)


/**
 * @swagger
 * /api/user/{id}:
 *   patch:
 *     summary: Actualizar perfil de usuario o avatar
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *               name:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado
 */
userRoute.patch("/:id", verifyTokenMiddleware, upload.single('avatar'), updateUser)

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: Eliminar un usuario (Solo ADMIN/CHEF)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 */
userRoute.delete("/:id", verifyTokenMiddleware, verifyRoleMiddleware([roleEnum[0], roleEnum[1]]), deleteUser)

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso, retorna el token
 *       401:
 *         description: Credenciales inválidas
 */
userRoute.post("/login", validateUser)

export default userRoute