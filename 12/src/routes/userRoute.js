import express from 'express'
import { createUser, createUserAdmin, deleteUser, getUser, updateUser, validateUser } from '../controllers/userController.js'
import { verifyTokenMiddleware } from '../middlewares/verifyTokenMiddleware.js'
import { verifyRoleMiddleware } from '../middlewares/verifyRoleMiddleware.js'
import { roleEnum } from '../models/userModel.js'

const userRoute = express.Router()

userRoute.post("/register", createUser)
userRoute.post("/", verifyTokenMiddleware, verifyRoleMiddleware([roleEnum[0]]), createUserAdmin)
userRoute.get("/", verifyTokenMiddleware, verifyRoleMiddleware([roleEnum[0]]), getUser)
userRoute.patch("/:id", verifyTokenMiddleware, updateUser)
userRoute.delete("/:id", verifyTokenMiddleware, deleteUser)
userRoute.post("/login", validateUser)

export default userRoute