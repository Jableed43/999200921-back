import express from 'express'
import { createUser, createUserView, deleteUser, getAllUserView, logout, updateUser, updateUserView, validateUser, validateUserView } from '../controllers/userController.js'
import {verifyTokenMiddleware} from "../middlewares/verifyTokenMiddleware.js"
import { isAuthenticated, isGuest } from '../middlewares/authMiddleware.js'

const userRouter = express.Router()

// Acciones
userRouter.post("/", createUser)
// userRouter.get("/", getUser)
// userRouter.get("/:id", getUserById)
userRouter.patch("/:id", isAuthenticated, updateUser)
userRouter.delete("/delete/:id", isAuthenticated, deleteUser)
userRouter.post("/login", isGuest, validateUser)
userRouter.post("/logout", isAuthenticated, logout)

// Vistas
userRouter.get("/create", isGuest, createUserView)
userRouter.get("/getAll", isAuthenticated, getAllUserView)
userRouter.get("/update/:id", isAuthenticated, updateUserView)
userRouter.get("/login", isGuest, validateUserView)

export default userRouter