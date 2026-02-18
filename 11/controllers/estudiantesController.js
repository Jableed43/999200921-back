
// request -> peticion

import { createEstudianteService, deleteEstudianteService, estudianteExistService, getAllEstudianteService, patchEstudianteService } from "../services/estudiantesService.js"

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

export const patchEstudiante = async (req, res) => {
    try {
        const { id } = req.params
        const { nombre, apellido, email, fechaNacimiento } = req.body

        // Validar que al menos un campo sea enviado
        if(!nombre && !apellido && !email && !fechaNacimiento){
            return res.status(400).json({
                success: false,
                error: "Debe enviar al menos un campo para actualizar",
                allowFields: ["nombre", "apellido", "email", "fechaNacimiento"]
            })
        }

        // Verificar si el estudiante existe
        const exists = await estudianteExistService(id)
        if(!exists){
            return res.status(404).json({
                success: false,
                error: "Estudiante no fue encontrado"
            })
        }

        const datosParciales = {}

        if(nombre !== undefined) { datosParciales.nombre = nombre }
        if(apellido !== undefined) { datosParciales.apellido = apellido }
        if(email !== undefined) { datosParciales.email = email }
        if(fechaNacimiento !== undefined) { datosParciales.fechaNacimiento = fechaNacimiento }

        const estudianteActualizado = await patchEstudianteService(id, datosParciales)

        if(!estudianteActualizado){
            return res.status(404).json({
                success: false,
                error: "Estudiante no encontrado"
            })
        }

        res.json({
            success: true,
            message: "Estudiante actualizado parcialmente de forma correcta",
            data: estudianteActualizado
        })

    } catch (error) {
        console.error("Error al actualizar el estudiante", error)

        res.status(500).json({
            success: false,
            error: "Error al actualizar el estudiante",
            message: error.message
        })
    }
}

export const deleteEstudiante = async (req, res) => {
    try {
        const {id} = req.params

         // validar si existe
            const exists = await estudianteExistService(id)
        
            if(!exists){
                return res.status(404).json({
                    success: false,
                    message: "Estudiante no encontrado"
                })
            }

            await deleteEstudianteService(id)

            res.json({
                success: true,
                message: "Estudiante eliminado correctamente",
                data: {
                     id: parseInt(id)
                }
            })

    } catch (error) {
        console.error("Error al eliminar estudiante", error)

        res.status(500).json({
            success: false,
            error: "Error al eliminar estudiante",
            message: error.message
        })
    }
}