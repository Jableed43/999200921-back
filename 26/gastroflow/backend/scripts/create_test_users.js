import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import Usuario from '../src/models/usuarioModel.js'

dotenv.config()

const users = [
    { nombre: 'Admin', apellido: 'Sistema', email: 'admin@gastro.com', password: 'Password123', role: 'ADMIN' },
    { nombre: 'Chef', apellido: 'Cocina', email: 'chef@gastro.com', password: 'Password123', role: 'CHEF' },
    { nombre: 'Mozo', apellido: 'Salon', email: 'mozo@gastro.com', password: 'Password123', role: 'MOZO' },
]

const createUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gastroflow')
        console.log('🔗 Conectado a MongoDB')

        for (const u of users) {
            const exists = await Usuario.findOne({ email: u.email })
            if (exists) {
                console.log(`⚠️ El usuario ${u.email} ya existe.`)
                continue
            }
            
            // Nota: el modelo ya tiene un pre-save hook para hashear la contraseña,
            // pero si usamos insertMany o create con objetos planos funciona.
            await Usuario.create(u)
            console.log(`✅ Usuario ${u.role} creado: ${u.email}`)
        }

        console.log('🚀 Proceso finalizado')
        process.exit(0)
    } catch (error) {
        console.error('❌ Error:', error)
        process.exit(1)
    }
}

createUsers()
