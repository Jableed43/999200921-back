import express from 'express'
import { createUser, createUserView, deleteUser, getAllUserView, logout, updateUser, validateUser } from '../controllers/userController.js'
import {verifyTokenMiddleware} from "../middlewares/verifyTokenMiddleware.js"

const userRouter = express.Router()

// Acciones
userRouter.post("/", createUser)
// userRouter.get("/", getUser)
// userRouter.get("/:id", getUserById)
userRouter.patch("/:id", verifyTokenMiddleware, updateUser)
userRouter.delete("/delete/:id", deleteUser)
userRouter.post("/login", validateUser)
userRouter.post("/logout", logout)

// Vistas
userRouter.get("/create", createUserView)
userRouter.get("/getAll", getAllUserView)

export default userRouter