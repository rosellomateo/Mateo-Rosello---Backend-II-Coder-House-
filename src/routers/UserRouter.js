import {Router} from 'express'

import UserController from "../controllers/UserController.js"
import passportCall from "../security/passportCall.js"

const UserRouter = Router()

UserRouter.post("/register", UserController.register)
UserRouter.post("/login", UserController.login)
UserRouter.get("/current",[passportCall('current')],UserController.privateData)

export default UserRouter
