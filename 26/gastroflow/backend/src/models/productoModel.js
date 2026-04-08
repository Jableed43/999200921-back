import mongoose from 'mongoose'

export const tipoEnum = ['compuesto', 'directo']
// compuesto: tiene receta con ingredientes (ej: Hamburguesa)
// directo:   se descuenta 1 unidad de un único insumo (ej: Gaseosa)

// Sub-documento: un ingrediente dentro de la receta del plato
const recetaItemSchema = new mongoose.Schema({
    insumo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'insumo',
        required: true,
    },
    cantidad: {
        type: Number,
        required: [true, 'La cantidad del ingrediente es obligatoria'],
        min: [0.01, 'La cantidad debe ser mayor a cero'],
    },
}, { _id: false })

const productoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del producto es obligatorio'],
        unique: true,
        trim: true,
        lowercase: true,
    },
    precio_venta: {
        type: Number,
        required: [true, 'El precio de venta es obligatorio'],
        min: [0, 'El precio no puede ser negativo'],
    },
    tipo: {
        type: String,
        validate: {
            validator: function (value) {
                return tipoEnum.includes(value)
            },
            message: props => `${props.value} no es un tipo válido. Opciones: ${tipoEnum.join(', ')}`
        },
        required: true,
    },
    // Solo para tipo "directo": referencia al insumo que se descuenta
    insumo_directo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'insumo',
        default: null,
    },
    // Solo para tipo "compuesto": lista de ingredientes
    receta: [recetaItemSchema],
    activo: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true })

productoSchema.set('toJSON', { getters: true, virtuals: true })

export default mongoose.model('producto', productoSchema)
