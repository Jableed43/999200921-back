import mongoose from 'mongoose'

const statusEnum = ["AVAILABLE", "NOT_AVAILABLE", "DISCONTINUED"]

const productSchema = new mongoose.Schema({
    // name
    name: {
        type: String,
        required: [true, "Name field is required"],
        // Largo minimo de caracteres
        minLength: 2,
        // Campo unico
        unique: [true, "Name is an unique field"],
        // Convierte a minuscula
        lowercase: true,
        // Elimina espacios al inicio y al final del campo
        trim: true
    },

    // price
    price: {
    type: mongoose.Types.Decimal128,
    required: [true, "Price field is required"],
    min: [0, "Price field has to be a number"],
    // El "set" asegura que siempre se guarde con el formato correcto
    set: v => mongoose.Types.Decimal128.fromString(v.toFixed(2)),
  },

    // description
    description: {
        type: String,
        minLength: 2,
        maxLength: 100,
        lowercase: true,
        // Elimina espacios al inicio y al final del campo 
        trim: true
    },
    // quantity
    quantity: {
        type: Number,
        min: 1,
        default: 1,
    },
    // status
    status: {
        type: String,
        validate: {
            validator: function (value) {
                // Verifica si el status que estoy recibiendo coincide con los guardados en mi enum
                return statusEnum.includes(value)
            },
            // Si el status recibido no coincide con el enum le manda un mensaje
            // props.value es el valor del status recibido
            message: props => `${props.value} no es un estado valido`
        }
    },
    // category
    category: String,
    // highlighted
    highlighted: Boolean,

    profitRate: {
        type: Number,
        default: 1.20,
        min: [1, "Profit rate must be grater than 1"]
    },
    image: String
})


productSchema.virtual("finalPrice").get(function () {
    return this.price * this.profitRate
})

productSchema.set("toJSON", {
    getters: true,
    setters: true,
    virtuals: true
})

export default mongoose.model("product", productSchema)