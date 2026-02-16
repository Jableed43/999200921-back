import dotenv from 'dotenv'

dotenv.config()

// Puerto de express
export const PORT = process.env.PORT || 3001

// Variables de entorno de MySQL
export const MYSQL_HOST = process.env.MYSQL_HOST
export const MYSQL_USER = process.env.MYSQL_USER
export const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD
export const MYSQL_DB_NAME = process.env.MYSQL_DB_NAME
export const MYSQL_PORT = process.env.MYSQL_PORT