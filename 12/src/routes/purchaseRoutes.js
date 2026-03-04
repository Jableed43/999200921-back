import express from 'express'
import { createPurchase } from '../controllers/purchaseController.js'

const purchaseRouter = express.Router()

purchaseRouter.post("/", createPurchase)

export default purchaseRouter