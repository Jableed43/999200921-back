import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { isGoodPassword } from '../utils/validators.js'

// Los tres roles del sistema:
// ADMIN → control total
// CHEF  → gestión de stock e insumos, visualización de ventas
// MOZO  → creación de comandas (ventas), visualización del menú
export const roleEnum = ['ADMIN', 'CHEF', 'MOZO']

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        minLength: [2, 'El nombre debe tener al menos 2 caracteres'],
        maxLength: [40, 'El nombre debe tener menos de 40 caracteres'],
        trim: true,
        lowercase: true,
    },
    apellido: {
        type: String,
        required: [true, 'El apellido es obligatorio'],
        minLength: [2, 'El apellido debe tener al menos 2 caracteres'],
        maxLength: [40, 'El apellido debe tener menos de 40 caracteres'],
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Por favor ingresá un email válido'],
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        validate: {
            validator: function (valor) {
                // Solo validamos al crear, no al actualizar (si ya está hasheada)
                if (this.isModified('password')) {
                    return isGoodPassword(valor)
                }
                return true
            },
            message: 'La contraseña debe tener entre 6 y 20 caracteres, al menos un número, una minúscula y una mayúscula',
        },
    },
    role: {
        type: String,
        validate: {
            validator: function (value) {
                return roleEnum.includes(value)
            },
            message: props => `"${props.value}" no es un rol válido. Opciones: ${roleEnum.join(', ')}`,
        },
        default: roleEnum[2], // MOZO por defecto
    },
    avatar: {
        type: String,
        default: 'https://cdn-icons-png.freepik.com/512/11820/11820201.png',
    },
    activo: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true })

// Hashear la contraseña antes de guardar
usuarioSchema.pre('save', async function () {
    if (!this.isModified('password')) return
    this.password = bcrypt.hashSync(this.password, 10)
})

usuarioSchema.set('toJSON', { getters: true, virtuals: true })

export default mongoose.model('usuario', usuarioSchema)
