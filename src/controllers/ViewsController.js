import ProductServices from "../services/ProductServices.js"
import CartServices from "../services/CartServices.js"
import {error500} from "../utils.js"

const redirectToProducts = (req, res) => {
    res.redirect("/products")
}

const renderProducts = async (req, res) => {
    try {
        let { docs: products, totalPages, hasNextPage, hasPrevPage, prevPage, nextPage } = await ProductServices.getProducts()
        res.render("home", { products, totalPages, hasNextPage, hasPrevPage, prevPage, nextPage })
    } catch (error) {
        error500(res, error)
    }
}

const renderCart = async (req, res) => {
    try {
        let cartId = req.params.cid
        let cartDb = await CartServices.getCartById(cartId)

        if (!cartDb) {
            res.setHeader('Content-Type', 'application/json')
            return res.status(404).json({ error: "cart not exist" })
        }

        res.render("cart", cartDb)
    } catch (error) {
        error500(res, error)
    }
}

const renderProductDetails = async (req, res) => {
    try {
        let productId = req.params.pid
        let productDb = await ProductServices.getProductById(productId)
        res.render("product", productDb)
    } catch (error) {
        error500(res, error)
    }
}

const renderRealTimeProducts = async (req, res) => {
    try {
        let productsDb = await ProductServices.getProducts()
        res.render("realTimeProducts", { products: productsDb })

        let io = req.io
        io.on("connection", (socket) => {
            console.log("webSocket on")
            console.log(`connect ${socket.id}`)

            socket.on("newProduct", async (product) => {
                let productDb = await ProductServices.getProduct(product.title, product.code)

                if (productDb) {
                    socket.emit("productExists", "The product exists in the database")
                } else {
                    await ProductServices.addProduct(
                        product.title,
                        product.description,
                        product.code,
                        product.price,
                        product.status,
                        product.stock,
                        product.category,
                        product.thumbnails
                    )
                    const productCreate = await ProductServices.getProduct(product.title, product.code)
                    io.emit("productAdded", productCreate)
                }
            })
        })
    } catch (error) {
        error500(res, error)
    }
}

export default {redirectToProducts,renderProducts,renderCart,renderProductDetails,renderRealTimeProducts}