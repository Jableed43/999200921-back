import { createInsumoService, getAllInsumoService, getInsumoByIdService, updateInsumoService, deleteInsumoService } from '../services/insumoService.js'
import { handleError } from '../utils/errorHandler.js'

export const createInsumo = async (req, res) => {
    try {
        const saved = await createInsumoService(req.body)
        res.status(201).json(saved)
    } catch (error) {
        handleError(error, res)
    }
}

export const getAllInsumo = async (req, res) => {
    try {
        const insumos = await getAllInsumoService(req.query)
        res.status(200).json(insumos)
    } catch (error) {
        handleError(error, res)
    }
}

export const getInsumoById = async (req, res) => {
    try {
        const insumo = await getInsumoByIdService(req.params.id)
        res.status(200).json(insumo)
    } catch (error) {
        handleError(error, res)
    }
}

export const updateInsumo = async (req, res) => {
    try {
        const updated = await updateInsumoService(req.params.id, req.body)
        res.status(200).json(updated)
    } catch (error) {
        handleError(error, res)
    }
}

export const deleteInsumo = async (req, res) => {
    try {
        const result = await deleteInsumoService(req.params.id)
        res.status(200).json(result)
    } catch (error) {
        handleError(error, res)
    }
}
