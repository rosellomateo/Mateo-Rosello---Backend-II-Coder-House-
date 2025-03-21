import {Router} from 'express'

import ViewController from "../controllers/ViewsController.js"
import {passportCall} from "../security/passportCall.js"
const ViewsRouter = Router()

ViewsRouter.get("/",[passportCall('current')], ViewController.redirectToProducts)
ViewsRouter.get("/products",[passportCall('current')], ViewController.renderProducts)
ViewsRouter.get("/carts/:cid",[passportCall('current')], ViewController.renderCart)
ViewsRouter.get("/products/:pid",[passportCall('current')], ViewController.renderProductDetails)
//ViewsRouter.get("/realtimeproducts",[passportCall('current')], ViewController.renderRealTimeProducts)
ViewsRouter.get("/login",ViewController.renderLogin)
ViewsRouter.get("/register",ViewController.renderRegister)
ViewsRouter.get("/forgot-password",ViewController.renderForgotPassword)
ViewsRouter.get("/reset-password/:token",ViewController.renderResetPassword)


export default ViewsRouter