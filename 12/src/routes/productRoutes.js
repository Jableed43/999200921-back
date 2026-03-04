import express from 'express'
import { createProduct, deleteProduct, getProductById, updateProduct } from '../controllers/productController.js'
import { getAllProduct } from '../controllers/productController.js'

const productRouter = express.Router()

productRouter.post("/", createProduct)
productRouter.get("/", getAllProduct)
productRouter.get("/:id", getProductById)
productRouter.put("/:id", updateProduct)
productRouter.patch("/:id", updateProduct)
productRouter.delete("/:id", deleteProduct)

export default productRouter