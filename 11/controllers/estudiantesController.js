
// request -> peticion

import { createEstudianteService, getAllEstudianteService } from "../services/estudiantesService.js"

// response -> respuesta
export const createEstudiante = async (req, res) => {
    try {
        const { nombre, apellido, email, fechaNacimiento } = req.body

        // Validacion
        if(!nombre || !apellido || !email || !fechaNacimiento){
            return res.status(400).json({
                success: false,
                error: "Faltan campos requeridos",
                required: {nombre, apellido, email, fechaNacimiento}
            })
        }

        const nuevoEstudiante = await createEstudianteService({ nombre, apellido, email, fechaNacimiento })

        return res.status(201).json({
            success: true,
            message: "Estudiante creado correctamente",
            data: nuevoEstudiante
        })

    } catch (error) {
        console.error("Error al crear estudiante", error)

        return res.status(500).json({
            success: false,
            error: "Error al crear estudiante",
            message: error.message
        })
    }
}

export const getAllEstudiante = async (req, res) => {
    try {
        const estudiantes = await getAllEstudianteService()

        res.json({
            success: true,
            data: estudiantes,
            total: estudiantes.length
        })

    } catch (error) {
        console.error("Error al obtener estudiantes", error)

        return res.status(500).json({
            success: false,
            error: "Error al obtener estudiantes",
            message: error.message
        })
    }
}