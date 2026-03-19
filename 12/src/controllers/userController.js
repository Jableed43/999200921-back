import { roleEnum } from "../models/userModel.js"
import { createUserService, deleteUserService, getUserService, updateUserService, validateUserService } from "../services/userService.js"
import { handleError } from "../utils/errorHandler.js"

export const createUser = async (req, res) => {
    try {
        const userData = {
            ...req.body,
            role: roleEnum[2]
        }
        const result = await createUserService(userData)
        res.status(201).json(result)

    } catch (error) {
        handleError(error, res)
    }
}

export const createUserAdmin = async (req, res) => {
    try {
        const userData = req.body
        const result = await createUserService(userData)
        res.status(201).json(result)

    } catch (error) {
        handleError(error, res)
    }
}

export const getUser = async (req, res) => {
    try {
        const users = await getUserService()
        res.status(200).json(users)
    } catch (error) {
        handleError(error, res)
    }
}

export const updateUser = async (req, res) => {
    try {
        const {id} = req.params
        const userData = req.body
        const updatedUser = await updateUserService(id, userData)
        res.status(201).json(updatedUser)

    } catch (error) {
        handleError(error, res)
    }
}
// Solo potestad del admin
export const deleteUser = async (req, res) => {
    try {
        const {id} = req.params
        // Si quien intenta borrar la cuenta no es el dueño de la cuenta
        // o este no es administrador
        if(req.user.userId !== id && req.user.role !== roleEnum[0]){
            return res.status(403).json({message: "No autorizado"})
        }
        const deletedUser = await deleteUserService(id)
        res.status(201).json(deletedUser)
    } catch (error) {
         handleError(error, res)
    }
}

export const validateUser = async (req, res) => {
    try {
        const userData = req.body
        const result = await validateUserService(userData)
        return res.status(200).json(result)

    } catch (error) {
        handleError(error, res)
    }
}