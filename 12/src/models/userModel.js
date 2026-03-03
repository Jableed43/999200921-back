import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    //name
    name: {
        type: String,
        required: true,
        maxLength: [40, "Please keep name field under 40 characters"],
        minLength: [2, "Please keep name field above 2 characters"],
        trim: true,
        lowercase: true
    },
    //lastName
    lastName: {
        type: String,
        required: true,
        maxLength: [40, "Please keep name field under 40 characters"],
        minLength: [2, "Please keep name field above 2 characters"],
        trim: true,
        lowercase: true
    },
    //email
    email: {
        type: String,
        required: true,
        maxLength: [40, "Please keep name field under 40 characters"],
        minLength: [7, "Please keep name field above 2 characters"],
        trim: true,
        lowercase: true,
        unique: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please, use a valid email"]
    },
    //password
    password: {
        // Regex -> texto alfanumerico entre 6 y 16 caracteres
        // al menos una letra mayuscula y una minuscula
        // al menos un numero
        type: String,
        match: [/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,16}/],
        required: true,
    }

}, {timestamps: true})

userSchema.pre("save", async function() {
    // Solo va a hashear la contraseña si ha sido modificada o es nueva
    // En caso que el usuario modifique otra cosa que no sea la password
    // evita que se re-hashee la password ya guardada
    if(!this.isModified("password")){
        return
    }

    // Encriptamos
    this.password = bcrypt.hashSync(this.password, 10)
})

export default mongoose.model("user", userSchema)