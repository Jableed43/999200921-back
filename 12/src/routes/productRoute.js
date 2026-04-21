import express from 'express'
import { createProduct, deleteProduct, getAllProduct, updateProduct, getProductById } from '../controllers/productController.js'
import { verifyTokenMiddleware } from '../middlewares/verifyTokenMiddleware.js'
import { verifyRoleMiddleware } from '../middlewares/verifyRoleMiddleware.js'
import { roleEnum } from '../models/userModel.js'
import upload from '../middlewares/multerMiddleware.js'

const productRoute = express.Router()


// Creamos los endpoints

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Endpoints para gestionar productos del catalogo
 * 
 *  */ 

/**
 * @swagger
 * /api/product:
 *   post:
 *     summary: Crear un nuevo producto (Solo ADMIN/CHEF)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *       400:
 *         description: Error en la validación de los datos
 */
productRoute.post("/", verifyTokenMiddleware, verifyRoleMiddleware([roleEnum[0]], [roleEnum[1]]), upload.single('image'), createProduct)

/**
 * @swagger
 * /api/product:
 *   get:
 *     summary: Obtener todos los productos (Público)
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de productos obtenida correctamente
 *       500:
 *         description: Error interno del servidor
 */
productRoute.get("/", getAllProduct )

/**
 * @swagger
 * /api/product/{id}:
 *   get:
 *     summary: Obtener detalle de un producto por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único del producto
 *     responses:
 *       200:
 *         description: Producto encontrado con éxito
 *       404:
 *         description: No se encontró un producto con ese ID
 */
productRoute.get("/:id", getProductById)

/**
 * @swagger
 * /api/product/{id}:
 *   patch:
 *     summary: Actualizar datos o imagen de un producto (Solo ADMIN/CHEF)
 *     tags: [Products]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente
 *       404:
 *         description: Producto no encontrado
 */
productRoute.patch("/:id", verifyTokenMiddleware, verifyRoleMiddleware([roleEnum[0]], [roleEnum[1]]), upload.single('image'), updateProduct)

productRoute.put("/:id", verifyTokenMiddleware, verifyRoleMiddleware([roleEnum[0]], [roleEnum[1]]), upload.single('image'), updateProduct)

/**
 * @swagger
 * /api/product/{id}:
 *   delete:
 *     summary: Eliminar permanentemente un producto (Solo ADMIN/CHEF)
 *     tags: [Products]
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
 *         description: Producto eliminado del catálogo
 *       404:
 *         description: El producto no existe
 */
productRoute.delete("/:id", verifyTokenMiddleware, verifyRoleMiddleware([roleEnum[0]], [roleEnum[1]]), deleteProduct)

export default productRoute