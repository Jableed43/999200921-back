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