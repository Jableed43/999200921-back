import express from 'express'
import { createPurchase, getAllPurchases, getPurchaseById, getPurchasesByUser } from '../controllers/purchaseController.js'
import { verifyTokenMiddleware } from '../middlewares/verifyTokenMiddleware.js'
import { verifyRoleMiddleware } from '../middlewares/verifyRoleMiddleware.js'
import { roleEnum } from '../models/userModel.js'

const purchaseRoute = express.Router()

/**
 * @swagger
 * tags:
 *   name: Purchases
 *   description: Endpoints para la gestión de compras y pedidos
 */

/**
 * @swagger
 * /api/purchase:
 *   post:
 *     summary: Crear una nueva compra/pedido
 *     tags: [Purchases]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - products
 *               - total
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                     quantity:
 *                       type: number
 *               total:
 *                 type: number
 *     responses:
 *       201:
 *         description: Compra realizada con éxito
 */
purchaseRoute.post("/", verifyTokenMiddleware, createPurchase)

/**
 * @swagger
 * /api/purchase:
 *   get:
 *     summary: Obtener todas las compras (Solo ADMIN/CHEF)
 *     tags: [Purchases]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista completa de compras
 */
purchaseRoute.get("/", verifyTokenMiddleware, verifyRoleMiddleware([roleEnum[0]], [roleEnum[1]]), getAllPurchases)

/**
 * @swagger
 * /api/purchase/user/{id}:
 *   get:
 *     summary: Obtener historial de compras de un usuario
 *     tags: [Purchases]
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
 *         description: Historial del usuario obtenido
 */
purchaseRoute.get("/user/:id", verifyTokenMiddleware, getPurchasesByUser)

/**
 * @swagger
 * /api/purchase/{id}:
 *   get:
 *     summary: Obtener detalle de una compra específica
 *     tags: [Purchases]
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
 *         description: Detalle de la compra
 */
purchaseRoute.get("/:id", verifyTokenMiddleware, getPurchaseById)

export default purchaseRoute