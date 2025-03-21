import MongoDao from "./mongoDAO.js"
import productModel from "./Models/productModel.js"

class ProductDAO extends MongoDao{
    constructor(){
        super(productModel)
    }
    async addProduct(product){
        try {
            let {title, description, code, price, status, stock, category, thumbnails} = product
            let productDb = await productModel.findOne({title:title,code:code}).lean()
            if(productDb){
                throw new Error(`Product ${title} already exists`)
                return
            }
            let newProduct = {
                title: title,
                description: description,
                code: code,
                price: price,
                status: status,
                stock: stock,
                category: category
            }
            if(thumbnails){
                newProduct.thumbnails = thumbnails
            }
            return await this.model.create(newProduct)
        }
        catch(error){
            throw new Error(`Error adding product: ${error.message}`)
        }
    }

    async getProducts(){
        try{
            let productsDb = await this.model.paginate({},{lean:true,sort:{price:1}})
            return  productsDb || []
        }catch(error){
            throw new Error(`Error getting products: ${error.message}`)
        }
    }

    async getProductsFilter(query,limit,page,sort){
        try {
            let productsDb = await this.model.paginate(query,{lean:true,page,limit,sort:{price:sort}})
            return productsDb || []
        } catch (error) {
            throw new Error(`Error getting products: ${error.message}`)
        }
    }

    async getProduct(title,code){
        try {
            let productDb = await this.model.findOne({title:title,code:code}).lean()
            return productDb
        }catch(error){
            throw new Error(`Error getting product: ${error.message}`)
        }
    }
    async updateProduct(id,product){
        const {title, description, code, price, status, stock, category, thumbnails} = product 
        let productDb = await this.model.findOne({id:id}).lean()

        if (title)
            productDb.title = title
        if (description)
            productDb.description = description
        if (code)
            productDb.code = code
        if (price)
            productDb.price = price
        if (status)
            productDb.status = status
        if (stock)
            productDb.stock = stock
        if (category)
            productDb.category = category
        if (thumbnails)
            productDb.thumbnails = thumbnails
        
        await this.model.updateOne({id:id},productDb)
    }

    async deleteProduct(id){
        try {
            return await this.model.deleteOne({id:id})
        } catch (error) {
            throw new Error(`Error deleting product: ${error.message}`)
        }
    }
}

const productDAO = new ProductDAO(productModel)
export default productDAO