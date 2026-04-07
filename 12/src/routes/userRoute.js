import express from 'express'
import { createUser, createUserAdmin, deleteUser, getUser, updateUser, validateUser } from '../controllers/userController.js'
import { verifyTokenMiddleware } from '../middlewares/verifyTokenMiddleware.js'
import { verifyRoleMiddleware } from '../middlewares/verifyRoleMiddleware.js'
import { roleEnum } from '../models/userModel.js'
import upload from '../middlewares/multerMiddleware.js'

const userRoute = express.Router()

userRoute.post("/register", createUser)
userRoute.post("/", verifyTokenMiddleware, verifyRoleMiddleware([roleEnum[0]]), createUserAdmin)
userRoute.get("/", verifyTokenMiddleware, verifyRoleMiddleware([roleEnum[0]]), getUser)
userRoute.patch("/:id", verifyTokenMiddleware, upload.single('avatar'), updateUser)
userRoute.delete("/:id", verifyTokenMiddleware, verifyRoleMiddleware([roleEnum[0], roleEnum[1]]), deleteUser)
userRoute.post("/login", validateUser)

export default userRoute