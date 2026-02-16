import mysql from 'mysql2/promise'
import { MYSQL_DB_NAME, MYSQL_HOST, MYSQL_PASSWORD, MYSQL_PORT, MYSQL_USER } from './config.js'

export const pool = mysql.createPool({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DB_NAME,
    port: MYSQL_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

// Funcion para probar la conexion
export const testConnection = async () => {
    try {
        const connection = await pool.getConnection()
        console.log("Conexcion a MySQL establecida correctamente")
        connection.release()
        return true
    } catch (error) {
        console.error("Error al conectar a MySQL", error.message)
        return false
    }
}