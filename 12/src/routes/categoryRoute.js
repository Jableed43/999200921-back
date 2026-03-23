import express from 'express'
import { createCategory, deleteCategory, getAllCategories, updateCategory } from '../controllers/categoryController.js'
import { verifyTokenMiddleware } from '../middlewares/verifyTokenMiddleware.js'
import { verifyRoleMiddleware } from '../middlewares/verifyRoleMiddleware.js'
import { roleEnum } from '../models/userModel.js'

const categoryRoute = express.Router()

categoryRoute.get("/", getAllCategories)
categoryRoute.post("/", verifyTokenMiddleware, verifyRoleMiddleware([roleEnum[0]], [roleEnum[1]]), createCategory)
categoryRoute.patch("/:id", verifyTokenMiddleware, verifyRoleMiddleware([roleEnum[0]], [roleEnum[1]]), updateCategory)
categoryRoute.delete("/:id", verifyTokenMiddleware, verifyRoleMiddleware([roleEnum[0]], [roleEnum[1]]), deleteCategory)

export default categoryRoute