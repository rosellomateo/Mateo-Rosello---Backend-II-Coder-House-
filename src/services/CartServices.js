import CartDAO from '../DAO/Mongo/cartDAO.mongo.js'
import Services from './Services.js'

class CartServices extends Services{
    constructor(DAO){
        super(DAO)
    }
    async addProduct(idCart,idProduct){
        try {
            return await CartDAO.addProduct(idCart,idProduct)
        } catch (error) {
            throw new Error(`Error adding product to cart: ${error.message}`)
        }
    }

    async newCart(){
        try {
            return await CartDAO.createCart()  
        } catch (error) {
            console.error(`error to create Cart: ${error}`)
        }
        
    }
    
    async getCartById(idCart){
        try{
            return await CartDAO.getCartById(idCart)
        }catch(error){
            console.error(`error to get Cart: ${error}`)
        }
        
    }

    async updateCart(idCart,products){
        try {
            return await CartDAO.updateCart(idCart,products)
        } catch (error) {
            console.error(`error to update products: ${error}`)
        }
    }

    async updateQuantity(idCart,idProduct,quantity){
        try {
            return await CartDAO.updateQuantity(idCart,idProduct,quantity)
        } catch (error) {
            console.error(`error to update products: ${error}`)
        }
    }

    async getProduct(idCart,code){
        try{
            return await CartDAO.getProduct(idCart,code)
        }catch(error){
            throw new Error(`error to get product: ${error}`)
        }
    }

    async deleteProduct(idCart,idProduct){
        try{
            return await CartDAO.deleteProduct(idCart,idProduct)
        }catch(error){
            throw new Error(`error to delete product: ${error}`)
        }
    }

    async clearCart(idCart){
        try{
            return await CartDAO.clearCart(idCart)
        }catch(error){
            throw new Error(`error to delete product: ${error}`)
        }
        
    }
}

const cartServices = new CartServices(CartDAO)
export default cartServices