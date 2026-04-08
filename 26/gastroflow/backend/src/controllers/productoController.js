import { createProductoService, getAllProductoService, getProductoByIdService, updateProductoService, deleteProductoService } from '../services/productoService.js'
import { handleError } from '../utils/errorHandler.js'

export const createProducto = async (req, res) => {
    try {
        const saved = await createProductoService(req.body)
        res.status(201).json(saved)
    } catch (error) {
        handleError(error, res)
    }
}

export const getAllProducto = async (req, res) => {
    try {
        const productos = await getAllProductoService(req.query)
        res.status(200).json(productos)
    } catch (error) {
        handleError(error, res)
    }
}

export const getProductoById = async (req, res) => {
    try {
        const producto = await getProductoByIdService(req.params.id)
        res.status(200).json(producto)
    } catch (error) {
        handleError(error, res)
    }
}

export const updateProducto = async (req, res) => {
    try {
        const updated = await updateProductoService(req.params.id, req.body)
        res.status(200).json(updated)
    } catch (error) {
        handleError(error, res)
    }
}

export const deleteProducto = async (req, res) => {
    try {
        const result = await deleteProductoService(req.params.id)
        res.status(200).json(result)
    } catch (error) {
        handleError(error, res)
    }
}
