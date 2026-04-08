import jwt from 'jsonwebtoken'
import { SECRET } from '../config/config.js'

export const verifyToken = (token) => {
    return jwt.verify(token, SECRET)
}
