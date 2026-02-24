import express from 'express'
import { createCategory, deleteCategory, getAllCategory } from '../controllers/categoryController.js'

const categoryRouter = express.Router()

categoryRouter.get("/", getAllCategory)
categoryRouter.post("/", createCategory)
categoryRouter.delete("/:id", deleteCategory)

export default categoryRouter