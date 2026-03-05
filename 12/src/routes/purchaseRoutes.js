import express from 'express'
import { createPurchase, getAllPurchase, getByIdPurchase, getByUserIdPurchase } from '../controllers/purchaseController.js'

const purchaseRouter = express.Router()

purchaseRouter.post("/", createPurchase)
purchaseRouter.get("/", getAllPurchase)
purchaseRouter.get("/:id", getByIdPurchase)
purchaseRouter.get("/user/:id", getByUserIdPurchase)

export default purchaseRouter