import express from "express"
import ViewController from "../controllers/ViewsController.js"

const ViewsRouter = express.Router()

ViewsRouter.get("/", ViewController.redirectToProducts)
ViewsRouter.get("/products", ViewController.renderProducts)
ViewsRouter.get("/carts/:cid", ViewController.renderCart)
ViewsRouter.get("/products/:pid", ViewController.renderProductDetails)
ViewsRouter.get("/realtimeproducts", ViewController.renderRealTimeProducts)
ViewsRouter.post("/login")
ViewsRouter.get("/profile")

export default ViewsRouter