import { createPurchaseService } from "../services/purchaseService.js"
import { handleError } from "../utils/errorHandler.js"

export const createPurchase = async (req, res) => {
    try {
        const purchase = await createPurchaseService(req.body)
        return res.status(201).json(purchase)
    } catch (error) {
        handleError(error, res)
    }
}