import {Schema, model} from "mongoose"

const userCollection = "users"

const userSchema = new Schema({
    first_name:{type: String, require: true},
    last_name:{type: String, require: true},
    email:{type: String, require: true,unique: true},
    age: {type: Number, require: true},
    username: {type: String, unique: true,require: true},
    password: {type: String, require: true},
    cart: {type: Schema.Types.ObjectId, ref: "carts", require:true},
    role: {type: String,default: "user",},
})

const userModel = model(userCollection, userSchema)

export default userModel