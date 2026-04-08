import mongoose from 'mongoose'

export const estadoEnum = ['PENDIENTE', 'LISTO', 'ENTREGADO', 'CANCELADO']

// Sub-documento: cada línea de la comanda
const ventaItemSchema = new mongoose.Schema({
    producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'producto',
        required: true,
    },
    nombre_producto: { type: String, required: true },
    cantidad:        { type: Number, required: true, min: 1 },
    precio_unitario: { type: Number, required: true },
    costo_unitario:  { type: Number, required: true },
    notas:           { type: String, default: '' }, // Notas de personalización (ej: "sin cebolla")
}, { _id: false })

const ventaSchema = new mongoose.Schema({
    items: {
        type: [ventaItemSchema],
        validate: [arr => arr.length > 0, 'La comanda debe tener al menos un item'],
    },
    mozo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuario',
        required: true,
    },
    estado: {
        type: String,
        validate: {
            validator: function (value) {
                return estadoEnum.includes(value)
            },
            message: props => `${props.value} no es un estado válido. Opciones: ${estadoEnum.join(', ')}`
        },
        default: 'PENDIENTE',
    },
    total_ingresos: { type: Number, required: true },
    total_costo:    { type: Number, required: true },
    margen:         { type: Number, required: true },
    // Timestamps de proceso
    preparadoAt:    { type: Date },
    entregadoAt:    { type: Date },
}, { timestamps: true })

ventaSchema.set('toJSON', { getters: true, virtuals: true })

export default mongoose.model('venta', ventaSchema)
