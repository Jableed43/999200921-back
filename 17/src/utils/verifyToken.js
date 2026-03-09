import jwt from 'jsonwebtoken'

// Valida que el token sea correcto a traves del secret
export function verifyToken(token) {
    try {
       const decoded = jwt.verify(token, "secret")
       return decoded
    } catch (error) {
        throw new Error("Invalid Token")
    }
}