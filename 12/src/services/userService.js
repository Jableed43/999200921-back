import { checkModelExist } from "../helpers/checkExist.js"
import User from '../models/userModel.js'

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