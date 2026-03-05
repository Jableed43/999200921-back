import { createPurchaseService, getAllPurchaseService, getByIdPurchaseService, getByUserIdPurchaseService } from "../services/purchaseService.js"
import { handleError } from "../utils/errorHandler.js"

export const createPurchase = async (req, res) => {
    try {
        const purchase = await createPurchaseService(req.body)
        return res.status(201).json(purchase)
    } catch (error) {
        handleError(error, res)
    }
}

export const getAllPurchase = async (req, res) => {
    try {
        const purchases = await getAllPurchaseService()
        return res.status(200).json(purchases)
    } catch (error) {
        handleError(error, res)
    }
}

export const getByIdPurchase = async (req, res) => {
    try {
        const {id} = req.params
        const purchase = await getByIdPurchaseService(id)
        return res.status(200).json(purchase)
    } catch (error) {
        handleError(error, res)
    }
}

export const getByUserIdPurchase = async (req, res) => {
    try {
        const {id} = req.params
        const purchases = await getByUserIdPurchaseService(id)
        return res.status(200).json(purchases)
    } catch (error) {
        handleError(error, res)
    }
}