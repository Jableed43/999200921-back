import express from 'express'
import { createEstudiante, getAllEstudiante,  } from '../controllers/estudiantesController.js'

const router = express.Router()

router.post("/", createEstudiante)
router.get("/", getAllEstudiante)

export default router