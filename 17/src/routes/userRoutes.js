import express from 'express'
import { createUser, deleteUser, getUser, getUserById, logout, updateUser, validateUser } from '../controllers/userController.js'
import {verifyTokenMiddleware} from "../middlewares/verifyTokenMiddleware.js"

const userRouter = express.Router()

userRouter.post("/", createUser)
userRouter.get("/", getUser)
userRouter.get("/:id", getUserById)
userRouter.patch("/:id", verifyTokenMiddleware, updateUser)
userRouter.delete("/:id", verifyTokenMiddleware, deleteUser)
userRouter.post("/login", validateUser)
userRouter.post("/logout", logout)

export default userRouter