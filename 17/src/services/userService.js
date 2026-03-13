import { SECRET } from "../config/config.js"
import { checkModelExist } from "../helpers/checkExist.js"
import User from '../models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const createUserService = async (userData) => {
    const newUser = new User(userData)
    const savedUser = await newUser.save()
    return savedUser
}

// export const getUserService = async () => {
//    const users = await User.find().lean()
//     return users
// }

export const getUserService = async () => {
    // Traemos los usuarios reales de la base de datos
    const users = await User.find().lean();

    // Generamos el nuevo índice 'id' basado en la posición
    for (let i = 0; i < users.length; i++) {
        // Creamos la propiedad 'id' (sumamos 1 para que empiece en 1 y no en 0)
        users[i].id = i + 1;
    }

    return users;
};

export const updateUserService = async (id, userData) => {
    const user = await User.findById(id)
    if(!user){
        throw { message: "Usuario no encontrado", statuscode: 404 }
    }
    //Actualiza los campos
    Object.assign(user, userData)

    return await user.save()
}

export const deleteUserService = async (id) => {
    console.log(id)
   const response = await User.deleteOne({_id: id})
   console.log(response)
   return { message: "User deleted" }
}

export const getUserByIdService = async (id) => {
   const user = await User.findById(id).lean()
    return user
}

export const validateUserService = async (userData) => {
    const {password, email} = userData

    if(!(password && email)){
        throw new Error("Email y contraseña son requeridos")
    }

    const userFound = await checkModelExist(User, {email}, true, null, `Usuario no encontrado`)

     if(!userFound || !bcrypt.compareSync(password, userFound.password)){
        const error = new Error("Credenciales invalidas")
        error.statusCode = 400
        throw error
     }

     // JWT
     // Armamos el token con informacion del usuario
     const payload = {
        userId: userFound._id,
        userEmail: userFound.email
     }

     // Firmar el token
    // La firma previene intentos de utilizar tokens falsos o duplicados
    const token = jwt.sign(payload, SECRET, {expiresIn: "1h"})

     return {token, userId: userFound._id, userEmail: userFound.email }
}

