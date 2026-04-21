import express from 'express'
import { createCategory, deleteCategory, getAllCategories, updateCategory } from '../controllers/categoryController.js'
import { verifyTokenMiddleware } from '../middlewares/verifyTokenMiddleware.js'
import { verifyRoleMiddleware } from '../middlewares/verifyRoleMiddleware.js'
import { roleEnum } from '../models/userModel.js'

const categoryRoute = express.Router()

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Endpoints para la gestión de categorías de productos
 */

/**
 * @swagger
 * /api/category:
 *   get:
 *     summary: Obtener todas las categorías
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Lista de categorías obtenida
 */
categoryRoute.get("/", getAllCategories)

/**
 * @swagger
 * /api/category:
 *   post:
 *     summary: Crear una nueva categoría (Solo ADMIN/CHEF)
 *     tags: [Categories]
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Categoría creada
 */
categoryRoute.post("/", verifyTokenMiddleware, verifyRoleMiddleware([roleEnum[0]], [roleEnum[1]]), createCategory)

/**
 * @swagger
 * /api/category/{id}:
 *   patch:
 *     summary: Actualizar una categoría (Solo ADMIN/CHEF)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Categoría actualizada
 */
categoryRoute.patch("/:id", verifyTokenMiddleware, verifyRoleMiddleware([roleEnum[0]], [roleEnum[1]]), updateCategory)

/**
 * @swagger
 * /api/category/{id}:
 *   delete:
 *     summary: Eliminar una categoría (Solo ADMIN/CHEF)
 *     tags: [Categories]
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
 *         description: Categoría eliminada
 */
categoryRoute.delete("/:id", verifyTokenMiddleware, verifyRoleMiddleware([roleEnum[0]], [roleEnum[1]]), deleteCategory)

export default categoryRoute