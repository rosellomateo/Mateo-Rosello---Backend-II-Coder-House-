import express from "express"
import ProductController from "../controllers/ProductController.js"

const ProductRouter = express.Router()

ProductRouter.get("/", ProductController.getProducts)
ProductRouter.get("/:pid", ProductController.getProductById)
ProductRouter.post("/", ProductController.createProduct)
ProductRouter.put("/:pid", ProductController.updateProduct)
ProductRouter.delete("/:pid", ProductController.deleteProduct)

export default ProductRouter