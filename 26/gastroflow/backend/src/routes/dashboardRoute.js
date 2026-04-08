import express from 'express'
import { getDashboard } from '../controllers/dashboardController.js'
import { verifyTokenMiddleware } from '../middlewares/verifyTokenMiddleware.js'
import { verifyRoleMiddleware } from '../middlewares/verifyRoleMiddleware.js'
import { roleEnum } from '../models/usuarioModel.js'

const dashboardRoute = express.Router()

// Solo ADMIN y CHEF acceden al dashboard financiero
dashboardRoute.get('/', verifyTokenMiddleware, verifyRoleMiddleware([roleEnum[0], roleEnum[1]]), getDashboard)

export default dashboardRoute
