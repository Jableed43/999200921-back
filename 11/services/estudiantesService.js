import { pool } from "../config/db.js"

export const createEstudianteService = async (estudianteData) => {
    const { nombre, apellido, email, fechaNacimiento } = estudianteData

    const query = "INSERT INTO estudiante (nombre, apellido, email, fechaNacimiento) VALUES (?, ?, ?, ?)"

    const [result] = await pool.query(query, [nombre, apellido, email, fechaNacimiento])

    return { idestudiante: result.insertId, nombre, apellido, email, fechaNacimiento }
}


export const getAllEstudianteService = async () => {
    const query = "SELECT * FROM estudiante ORDER BY idestudiante ASC"
    const [estudiantes] = await pool.query(query)

    return estudiantes
}

// Traer estudiante por ID
export const getEstudianteByIdService = async (id) => {
    const query = "SELECT * FROM estudiante WHERE idestudiante = ?"

    const [estudiante] = await pool.query(query, [id])

    if(estudiante.length === 0){
        return null
    }
    return estudiante[0]
}

// Verificar si un estudiante existe
export const estudianteExistService = async (id) => {
    const estudiante = await getEstudianteByIdService(id)
    // si encuentra el estudiante retorna true, si no retorna false
    return estudiante !== null
}

export const patchEstudianteService = async (id, estudianteData) => {
    // buscamos el estudiante
    const estudianteActual = await getEstudianteByIdService(id)
    if(!estudianteActual){
        return null
    }
    // Combinar los datos actuales con los nuevos
    // porque la query es SET, entonces espera todos los datos
    // ?? es un tipo de condicional que solo usa dos valores
    // se suele usar cuando estas seguro que uno de los dos valores tiene informacion (true)
    const datosActualizados = {
        nombre: estudianteData.nombre ?? estudianteActual.nombre,
        apellido: estudianteData.apellido ?? estudianteActual.apellido,
        email: estudianteData.email ?? estudianteActual.email,
        fechaNacimiento: estudianteData.fechaNacimiento ?? estudianteActual.fechaNacimiento
    }
    const query = "UPDATE estudiante SET nombre = ?, apellido = ?, email = ?, fechaNacimiento = ? WHERE idestudiante = ?"
    await pool.query(query, [
        datosActualizados.nombre,
        datosActualizados.apellido,
        datosActualizados.email,
        datosActualizados.fechaNacimiento,
        id
    ])
    return {
        id: parseInt(id),
        ...datosActualizados
    }

}

export const deleteEstudianteService = async (id) => {

    const query = "DELETE FROM estudiante WHERE idestudiante = ?"

    const response = await pool.query(query, [id])
    console.log({response})

    return true

}