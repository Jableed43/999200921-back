import jwt from 'jsonwebtoken'
import { SECRET } from '../config/config.js'
import { verifyToken } from '../utils/verifyToken.js'

// Verifica que el request tenga un JWT válido en el header Authorization
export const verifyTokenMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Token de acceso requerido' })
        }

        const token = authHeader.split(' ')[1]
        const decoded = verifyToken(token)

        // Guardamos el payload decodificado en req.user para usarlo en los controllers
        req.user = decoded

        next()
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o expirado', error: error.message })
    }
}

// Genera un JWT con los datos del usuario (payload)
export const generateToken = (payload) => {
    return jwt.sign(payload, SECRET, { expiresIn: '8h' })
}
