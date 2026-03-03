import { checkModelExist } from "../helpers/checkExist.js"
import User from '../models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const createUserService = async (userData) => {
    const {email} = userData
    await checkModelExist(User, {email}, false, 400, `User with email ${email} already exists`)

    const newUser = new User(userData)
    const savedUser = await newUser.save()
    // despues deberiamos quitar la password al retornar el usuario
    return savedUser
}

export const getUserService = async () => {
   const users = await User.find()
    return users
}

export const updateUserService = async (id, userData) => {
    await checkModelExist(User, {_id: id}, true, 404, `User not found`)

    // Hashea la password al editarla
    if(userData.password){
        userData.password = bcrypt.hashSync(userData.password, 10)
    }

    const updatedUser = await User.findByIdAndUpdate(
        {_id: id},
        userData,
        { returnDocument: "after" }
    )

    return updatedUser
}

export const deleteUserService = async (id) => {
   await User.deleteOne({_id: id})
   return { message: "User deleted" }
}

export const getUserByIdService = async (id) => {
   const user = await User.findById(id)
    return user
}

export const validateUserService = async (userData) => {
    const {password, email} = userData

    if(!(password && email)){
        const error = new Error("There's a missing field")
        error.statusCode = 400
        throw error
    }

    const userFound = await checkModelExist(User, {email}, true, 404, `User or password are incorrect`)

     if(!bcrypt.compareSync(password, userFound.password)){
        const error = new Error("User or password are incorrect")
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
    const token = jwt.sign(payload, "secret", {expiresIn: "1h"})

     return {message: "Logged in", token}
}

