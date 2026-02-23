import { createProductService, deleteProductService, getAllProductService, updateProductService } from "../services/productService.js"

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

export const getAllProduct = async (req, res) => {
    try {
        const products = await getAllProductService()
        res.status(200).json(products)
    } catch (error) {
        const statusCode = error.statusCode || 500
        res.status(statusCode).json({
            message: error.message || "Internal server error",
        })
    }
}

export const updateProduct = async (req, res) => {
    try {
       const { id } = req.params
       const productData = req.body

       const updatedProduct = await updateProductService(id, productData)

       res.status(201).json(updatedProduct)

    } catch (error) {
        const statusCode = error.statusCode || 500
        res.status(statusCode).json({
            message: error.message || "Internal server error",
        })
    }
}

export const deleteProduct = async (req, res) => {
    try {
    const {id} = req.params
    const response = await deleteProductService(id)
    res.status(201).json(response)
    } catch (error) {
         const statusCode = error.statusCode || 500
        res.status(statusCode).json({
            message: error.message || "Internal server error",
        })
    }
}