export class ProductResDTO{
    constructor(product){
        this.title = product.title
        this.code = product.code
        this.price = product.price
        this.stock = product.stock
        this.category = product.category
        this.thumbnails = product.thumbnails
    }
}