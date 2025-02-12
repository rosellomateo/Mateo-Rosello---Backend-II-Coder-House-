import CartServices from "../services/CartServices.js"
import ProductServices from "../services/ProductServices.js"
import {error500}  from "../utils.js"

const getCart = async(req,res)=>{
    try {
        const cartId = req.params.cid
        const cart = await CartServices.getCartById(cartId)
        if (!cart) {
            res.setHeader('Content-type','application-json')
            return res.status(404).json({ status: "error", error: "Cart not found" })
        }
        res.status(200).json({status: "success", cartId: cart._id,products: cart.products})
    } catch (error) {
        error500(res,error)
    }
}

const createCart = async(req,res)=>{
    try {
        let cart = await CartServices.newCart()
        let cartId = cart.id
        
        res.setHeader('Content-type','application/json')
        return res.status(201).json({status:"success",message:`Create Cart ${cartId}`})
    } catch (error) {
        error500(res,error)
    }
}

const addCartProduct = async(req,res)=>{
    try{
        let cartId = req.params.cid
        let cartDb = await CartServices.getCartById(cartId)
        
        if(!cartDb){
            res.setHeader('Content-Type', 'application/json')
            return res.status(404).json({error:"cart not exist"})
        }

        let productId = req.params.pid
        console.log(productId)
        
        let productDb = await ProductServices.getProductById(productId)

        if(!productDb){
            res.setHeader('Content-Type', 'application/json')
            return res.status(404).json({error:"product not exist"})
        }

        await CartServices.addProduct(cartId,productId)
        return res.status(201).json({status:"sucess",message:"product add"})
    }catch(error){
        error500(res,error)
    }
}

const updateCart = async (req,res)=>{
    try {
        let idCart = req.params.cid

        let cartDb = await CartServices.getCartById(idCart)
        if(!cartDb){
            res.setHeader('Content-Type', 'application/json')
            return res.status(404).json({error:"cart not exist"})
        }

        let products = req.body.products
        console.log(products)
        if(!Array.isArray(products)){
            res.setHeader('Content-Type', 'application/json')
            return res.status(404).json({error:"is not array of products"})
        }

        for (let i in products) {
            let productDb = await ProductServices.getProductById(products[i].product)
            if(!productDb){
                res.setHeader('Content-Type', 'application/json')
                return res.status(404).json({error:`Product ${products[i].product} not exist`})
            }
        }
        
        let result = await CartServices.updateCart(idCart,products)
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({status:'sucess',message:`Cart ${idCart} Update`,result})
    } catch (error) {
        error500(res,error)
    }
}

const updateCartProduct = async (req,res)=>{
    try {
        let idCart = req.params.cid
        let idProduct = req.params.pid
        
        let cartDb = await CartServices.getCartById(idCart)
        if(!cartDb){
            res.setHeader('Content-Type', 'application/json')
            return res.status(404).json({error:"cart not exist"})
        }
        
        let productDb = await ProductServices.getProductById(idProduct)
        if(!productDb){
            res.setHeader('Content-Type', 'application/json')
            return res.status(404).send({status:'error', message:'product not exist'})
        }

        let productCart = cartDb.products.find(p=>p.product.code === productDb.code)
        if(!productCart){
            res.setHeader('Content-Type', 'application/json')
            return res.status(404).send({status:'error', message:'product not in cart'})
        }
        
        let quantity = req.body.quantity
        quantity = Number(quantity)

        if(isNaN(quantity)){
            res.setHeader('Content-Type', 'application/json')
            return res.status(404).send({status:'error', message:'quantity is not a number'})
        }

        let result = await CartServices.updateQuantity(idCart,idProduct,quantity)
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({status:'success',message:`Cart ${idCart} Update`,result})
    } catch (error) {
        error500(res,error)
    }
}

const deleteCart = async(req,res)=>{
    try {
        let idCart = req.params.cid
    
        let cartDb = await CartServices.getCartById(idCart)
        if (!cartDb){
            res.setHeader('Content-Type', 'application/json')
            return res.status(404).send({status:'error', message:'cart not exist'})
        }

        let result = await CartServices.clearCart(idCart)
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).send({ status: 'success', message: 'cart empty: ', result })
    } catch (error) {
        error500(res,error)
    }
}

const deleteProductCart = async (req,res)=>{
    try{
        let idCart    = req.params.cid
        let idProduct = req.params.pid

        let cartDb = await CartServices.getCartById(idCart)
        if (!cartDb){
            res.setHeader('Content-Type', 'application/json')
            return res.status(404).send({status:'error', message:'cart not exist'})
        }

        let productDb = await ProductServices.getProductById(idProduct)
        if(!productDb){
            res.setHeader('Content-Type', 'application/json')
            return res.status(404).send({status:'error', message:'product not exist'})
        }
        let productCart = cartDb.products.find(p=>p.product.code === productDb.code)
        if(!productCart){
            res.setHeader('Content-Type', 'application/json')
            return res.status(404).send({status:'error', message:'product not in cart'})
        }
        let result = await CartServices.deleteProduct(idCart,idProduct)
        
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).send({ status: 'success', message: 'Product removed from cart', result })
    }catch(error){
        error500(res,error)
    }
        
}

export default {getCart,createCart,addCartProduct,updateCart,updateCartProduct,deleteCart,deleteProductCart}