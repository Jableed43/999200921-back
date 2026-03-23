import express from 'express'
import { createPurchase, getAllPurchases, getPurchaseById, getPurchasesByUser } from '../controllers/purchaseController.js'
import { verifyTokenMiddleware } from '../middlewares/verifyTokenMiddleware.js'
import { verifyRoleMiddleware } from '../middlewares/verifyRoleMiddleware.js'
import { roleEnum } from '../models/userModel.js'

const purchaseRoute = express.Router()

purchaseRoute.post("/", verifyTokenMiddleware, createPurchase)
purchaseRoute.get("/", verifyTokenMiddleware, verifyRoleMiddleware([roleEnum[0]], [roleEnum[1]]), getAllPurchases)
purchaseRoute.get("/user/:id", verifyTokenMiddleware, getPurchasesByUser)
purchaseRoute.get("/:id", verifyTokenMiddleware, getPurchaseById)

export default purchaseRoute