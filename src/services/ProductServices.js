import productDAO from '../DAO/Mongo/productDAO.mongo.js'
import Services from './Services.js'

class ProductServices extends Services{
    constructor(DAO){
        super(DAO)
    }
    async addProduct(product) {
        try {
            console.log(product)
            return await productDAO.addProduct(product)
        } catch (error) {
            throw new Error(`Error adding product: ${error}`)
        }
    }

    async getProducts() {
        try {
            return await productDAO.getProducts()
        } catch (error) {
            throw new Error(`Error get product: ${error}`)
        }
    }

    async getProductsFilter(query,limit,page,sort){
        try {
            return await productDAO.getProductsFilter(query,limit,page,sort)
        } catch (error) {
            throw new Error(`Error get product: ${error}`)
        }
    }

    async getProductById(id) {
        try {
            let productDb = await productDAO.getById(id)
            if(productDb){
                productDb.price = productDb.price.toString()
                productDb.price = parseFloat(productDb.price)
            }
            return productDb
        } catch (error) {
            throw new Error(`error to get product by id : ${error}`)
        }
        
    }

    async getProduct(title, code) {
        try {
            let productDb = await productDAO.getProduct(title, code)
            
            if(productDb){
                productDb.price = productDb.price.toString()
                productDb.price = parseFloat(productDb.price)
            }
            
            return productDb
        } catch (error) {
            throw new Error(error)
        }
        
    }

    async updateProduct(id,product) {
        try {
            return await productDAO.updateProduct(id,product)
        } catch (error) {
            throw new Error(`error to update product: ${error}`)
        }
        
        
    }

    async deleteProduct(id) {
        try {
            return await productDAO.deleteProduct(id)
        } catch (error) {
            throw new Error(`error to delete product: ${error}`)
        }
        
    }
}
const productServices = new ProductServices(productDAO)

export default productServices