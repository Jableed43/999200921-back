import mongoose from 'mongoose'

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

export default mongoose.model("user", userSchema)