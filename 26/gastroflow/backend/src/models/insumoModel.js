import mongoose from 'mongoose'

export const unidadEnum = ['gr', 'ml', 'unidad', 'kg', 'lt']

const insumoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del insumo es obligatorio'],
        unique: true,
        trim: true,
        lowercase: true,
    },
    stock_actual: {
        type: Number,
        required: [true, 'El stock actual es obligatorio'],
        min: [0, 'El stock no puede ser negativo'],
        default: 0,
    },
    stock_reservado: {
        type: Number,
        default: 0,
        min: [0, 'El stock reservado no puede ser negativo']
    },
    stock_minimo: {
        type: Number,
        required: [true, 'El stock mínimo es obligatorio'],
        min: [0, 'El stock mínimo no puede ser negativo'],
        default: 0,
    },
    unidad: {
        type: String,
        required: [true, 'La unidad es obligatoria'],
        validate: {
            validator: function (value) {
                return unidadEnum.includes(value)
            },
            message: props => `${props.value} no es una unidad válida. Opciones: ${unidadEnum.join(', ')}`
        }
    },
    costo_unitario: {
        type: Number,
        required: [true, 'El costo unitario es obligatorio'],
        min: [0, 'El costo no puede ser negativo'],
    },
}, { timestamps: true })

// Virtual: true si el stock neto (físico - reservado) está en alerta
insumoSchema.virtual('en_alerta').get(function () {
    const stockNeto = this.stock_actual - this.stock_reservado;
    return stockNeto <= this.stock_minimo;
})

insumoSchema.set('toJSON', { getters: true, virtuals: true })

export default mongoose.model('insumo', insumoSchema)
