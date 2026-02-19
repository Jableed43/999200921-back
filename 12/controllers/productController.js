import { createProductService } from "../services/productService.js"

export const createProduct = async (req, res) => {
    try {
        const productData = req.body
        const savedProduct = await createProductService(productData)
        res.status(201).json(savedProduct)
    } catch (error) {
        const statusCode = error.statusCode || 500
        res.status(statusCode).json({
            message: error.message || "Internal server error",
        })
    }
}