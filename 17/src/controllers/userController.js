import { updateProductService } from "../services/productService.js"
import { createUserService, deleteUserService, getUserByIdService, getUserService, updateUserService, validateUserService } from "../services/userService.js"
import { handleError } from "../utils/errorHandler.js"

// Vistas
export const createUserView = async (req, res) => {
    res.render("user/createUser", {
        title: "Registrar usuario"
    })
}

export const getAllUserView = async (req, res) => {
   const users = await getUserService()
   console.log(users)
   res.render("user/getAllUser", {title: "Lista de usuarios", users})
}


// Acciones
export const createUser2 = async (req, res) => {
    try {
        const userData = req.body
        const newUser = await createUserService(userData)
        res.status(201).json({ message: "User created successfully", data: newUser})
    } catch (error) {
        handleError(error, res)
    }
}

export const createUser = async (req, res) => {
    try {
        const userData = req.body
        await createUserService(userData)
        req.session.message = "Usuario creado con exito"
        req.session.success = true
        res.redirect("/")
    } catch (error) {
        req.session.message = "Error al crear usuario", error.message
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

export const deleteUser = async (req, res) => {
    try {
        const {id} = req.params
        await deleteUserService(id)
        req.session.message = "Usuario eliminado con exito"
        req.session.success = true
        res.redirect("/user/getAll")
    } catch (error) {
        if(error.statusCode === 404){
            req.session.message = "Usuario no encontrado"
        } else {
             req.session.message = "Error al eliminar usuario"
        }
        res.redirect("/user/getAll")
    }
}

export const getUserById = async (req, res) => {
    try {
        const {id} = req.params
        const user = await getUserByIdService(id)
        res.status(200).json(user)
    } catch (error) {
        handleError(error, res)
    }
}

export const validateUser = async (req, res) => {
    try {
        const userData = req.body
       const result = await validateUserService(userData)
       res.status(200).json(result)
    } catch (error) {
        handleError(error, res)
    }
}

export const logout = async (req, res) => {
    try {
        if(req.session){
            console.log(req.session)
            req.session.destroy()
            res.clearCookie("connect.sid")
        }

        return res.status(200).json({
            message: "Logged out successfully"
        })
    } catch (error) {
        handleError(error, res)
    }
}