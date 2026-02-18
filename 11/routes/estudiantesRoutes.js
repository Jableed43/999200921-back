import express from 'express'
import { createEstudiante, deleteEstudiante, getAllEstudiante, patchEstudiante,  } from '../controllers/estudiantesController.js'

const router = express.Router()

// Usamos la misma ruta para todas las acciones, lo que cambia es el verbo
router.post("/", createEstudiante)
router.get("/", getAllEstudiante)
router.patch("/:id", patchEstudiante)
router.delete("/:id", deleteEstudiante)

export default router