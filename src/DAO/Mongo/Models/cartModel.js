import mongoose from "mongoose"
import paginate from "mongoose-paginate-v2"

const cartCollection = "carts"

const cartSchema = new mongoose.Schema({
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId,ref: "products", required: true },
        quantity: { type: Number, required: true, min: 1 }
    }]}, 
    { timestamps: true })

cartSchema.plugin(paginate)
const cartModel = mongoose.model(cartCollection, cartSchema)

export default cartModel