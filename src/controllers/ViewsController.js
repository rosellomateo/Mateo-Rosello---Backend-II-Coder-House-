import ProductServices from "../services/ProductServices.js"
import CartServices from "../services/CartServices.js"
import {error500} from "../utils.js"
import jwt from "jsonwebtoken"
import userService from "../services/userServices.js"
const redirectToProducts = (req, res) => {
    res.redirect("/products")
}

const renderProducts = async (req, res) => {
    try {
        let { docs: products, totalPages, hasNextPage, hasPrevPage, prevPage, nextPage } = await ProductServices.getProducts()
        const {token} = req.cookies
        const email = jwt.decode(token).email
        const user = await userService.getByEmail(email)
        const cart = user.cart.toString()
        res.render("home", { products, totalPages, hasNextPage, hasPrevPage, prevPage, nextPage, cart })
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
        let product = await ProductServices.getProductById(productId)
        const {token} = req.cookies
        const email = jwt.decode(token).email
        const user = await userService.getByEmail(email)
        const cart = user.cart.toString()
        console.log(cart)
        res.render("product", {product, cart})
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

const renderLogin = async(req, res) => {
    try {
        console.log("login")
        res.render("login")
    }catch(error){
        error500(res, error)
    }
}

const renderRegister = async(req, res) => {
    try {
        console.log("register")
        res.render("register")
    }catch(error){
        error500(res, error)
    }
}

const renderForgotPassword = async(req, res) => {
    try {
        console.log("forgot password")
        res.render("forgotPassword")
    } catch (error) {
        error500(res, error)
    }
}

const renderResetPassword = async(req, res) => {
    try {
        console.log("reset password")
        res.render("resetPassword",{token:req.params.token})
    } catch (error) {
        error500(res, error)
    }
}

export default {redirectToProducts,renderProducts,renderCart,renderProductDetails,renderRealTimeProducts,renderLogin,renderRegister, renderForgotPassword,renderResetPassword}