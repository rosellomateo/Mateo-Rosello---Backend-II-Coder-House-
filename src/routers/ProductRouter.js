import {Router} from "express"

import ProductController from "../controllers/ProductController.js"
import { isAdmin } from "../security/passportCall.js"

const ProductRouter = Router()

ProductRouter.get("/", ProductController.getProducts)
ProductRouter.get("/:pid", ProductController.getProductById)
ProductRouter.post("/",[isAdmin()],ProductController.createProduct)
ProductRouter.put("/:pid",[isAdmin()], ProductController.updateProduct)
ProductRouter.delete("/:pid",[isAdmin()], ProductController.deleteProduct)

export default ProductRouter