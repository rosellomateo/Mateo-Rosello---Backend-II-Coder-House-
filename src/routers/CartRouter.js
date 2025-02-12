import express from "express"
import CartController from "../controllers/CartController.js"

const CartRouter = express.Router()

CartRouter.post("/",CartController.createCart)
CartRouter.get("/",CartController.createCart)
CartRouter.get("/:cid",CartController.getCart)
CartRouter.put("/:cid",CartController.updateCart)
CartRouter.delete("/:cid",CartController.deleteCart)
CartRouter.post("/:cid/products/:pid",CartController.addCartProduct)
CartRouter.put("/:cid/products/:pid",CartController.updateCartProduct)
CartRouter.delete("/:cid/products/:pid",CartController.deleteProductCart)

export default CartRouter