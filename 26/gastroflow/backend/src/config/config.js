import dotenv from 'dotenv'

dotenv.config()

export const PORT = process.env.PORT || 3000
export const MONGODB_URI = process.env.MONGO_URI
export const SECRET = process.env.SECRET

// Mercado Pago
export const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN
export const MP_PUBLIC_KEY = process.env.MP_PUBLIC_KEY
