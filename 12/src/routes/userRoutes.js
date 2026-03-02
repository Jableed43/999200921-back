import express from 'express'
import { createUser, deleteUser, getUser, getUserById, updateUser } from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.post("/", createUser)
userRouter.get("/", getUser)
userRouter.get("/:id", getUserById)
userRouter.patch("/:id", updateUser)
userRouter.delete("/:id", deleteUser)

export default userRouter