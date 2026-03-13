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
   try {
    const users = await getUserService()
   res.render("user/getAllUser", {title: "Lista de usuarios", users})
   } catch (error) {
    req.session.message = error.message || "Error al cargar los usuarios"
        res.redirect("/")
   }
}

export const updateUserView = async (req, res) => {
    try {
        const {id} = req.params
        const user = await getUserByIdService(id)
        console.log({user})
        res.render("user/updateUser", {
            title: "Editar usuario", user
        })
    } catch (error) {
        req.session.message = error.message || "Usuario no encontrado"
        res.redirect("/")
    }
}

export const validateUserView = (req, res) => {
    res.render("user/loginUser", {
        title: "Iniciar sesion"
    })
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
        await updateUserService(id, userData)
        req.session.message = "Usuario actualizado correctamente"
        req.session.success = true
        res.redirect("/")
    } catch (error) {
        
        req.session.message = error.message || "Error al actualizar usuario"
        res.redirect("/")
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
       
        req.session.token = result.token
        req.session.userId = result.userId
        req.session.userEmail = result.userEmail
        req.session.message = `¡Bienvenido/a ${userData.name} ${userData.lastName}`

        req.session.success = true
        res.redirect("/")

    } catch (error) {
        req.session.message = error.message || "Error al iniciar sesion"
        res.redirect("/")
    }
}

export const logout = async (req, res) => {
        if(!req.session){
            return res.redirect("/user/login")
        }

            req.session.destroy((err) => {
                if(err) console.error("Error al cerrar sesion: ", err)
                res.clearCookie("connect.sid")
                res.redirect("/")
            })
}