import MongoDAO from './mongoDAO.js'
import CartModel from './Models/cartModel.js'
import cartModel from './Models/cartModel.js'

class CartDao extends MongoDAO{
    constructor(model){
        super(CartModel)
    }

    async createCart(){
        try {
            return await super.create({})
        } catch (error) {
            throw new Error(error)
        }
    }

    async addProduct (idCart,idProduct){
        try {
            return await super.update( {_id: idCart, 
                "products.product": idProduct },
                {$inc: {"products.$.quantity": 1}})            
        } catch (error) {
            throw new Error(error)
        }
    }
    
    async getCartById(idCart){
        try{
            return await this.model.findById(idCart).populate('products.product')
           
        }catch(error){
            throw new Error(error)
        }
    }

    
    async updateCart(idCart,products){
        try {
            return await super.update(idCart,{products: products})
        }catch{
            throw new Error(error)
        }
    }   
    async updateQuantity(idCart,idProduct,quantity){
        try {
            let result = await this.model.findOne({_id:idCart,"products.product": idProduct})
            if(result){
                return await super.update({_id:idCart,"products.product": idProduct},{$set: {"products.$.quantity":quantity}})
            }else{
                return await super.update(idCart,{$push:{products:{product:idProduct,quantity:quantity}}})
            }
        } catch (error) {
            throw new Error(error)
        }
    }
    async getProduct(idCart,code){
        try{
            return await this.model.findOne({ _id: idCart, "products.product.code": code }).populate('products.product') 
        }catch(error){
            throw new Error(error)
        }
    }

    async deleteProduct(idCart,idProduct){
        try {
            return await super.update( {_id: idCart, 
                "products.product": idProduct },
                {$pull: {"products": {product: idProduct}}})            
        } catch (error) {
            throw new Error(error)
        }
    }

    async clearCart(idCart){
        try {
            return await super.update(idCart,{products: []})
        } catch (error) {
            throw new Error(error)
        }
    }
}

const cartDao = new CartDao(CartModel)
export default cartDao