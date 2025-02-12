import jwt from "jsonwebtoken";
import "dotenv/config";

import userDAO from "../DAO/userDAO.js"
import cartServices from "../services/CartServices.js"

const secretKey = process.env.SECRET_KEY;

class UserService{
    async generateToken (user){
        const {first_name,last_name,email,age,username,password,cart,role} = user
        
        const payload ={
            first_name:first_name,
            last_name: last_name,
            email:email,
            age:age,
            username: username,
            cart:cart,
            role:role
        }
        
        return jwt.sign(payload,secretKey,{expiresIn: "30m"})
    }
    async register (user){
        try {
            const {first_name,last_name,email,age,username,password} = user
            
            const userDb = await userDAO.findOne({username: username})
            if(userDb)
                throw new Error(`User: ${username} already exists.`)
            
            const cart = await cartServices.newCart()._id

            const newUser = {
                first_name:first_name,
                last_name: last_name,
                email:email,
                age:age,
                username: username,
                password: password,
                cart: cart
            }
            
            return await userDAO.create(newUser)
        } catch (error) {
            console.error(`Error to create User: ${error}`)
        }
    }
    async login (username,password){
        try {
            const userDb = await userDAO.findOne({username: username})
            if(!userDb){
                console.error(`User: ${username} don't exist`)
                return
            }
            if(userDb.password != password){
                console.error(`User: password incorrect`)
                return
            }
        } catch (error) {
            console.error(`Error to login User: ${error}`)
        }
    }

    async getUserByEmail(email){
        try {
            const 
        } catch (error) {
            
        }
    }
}

export const userService = new UserService()