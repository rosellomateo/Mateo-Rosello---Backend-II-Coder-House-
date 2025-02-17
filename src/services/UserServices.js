import jwt from "jsonwebtoken"
import "dotenv/config"

import userDAO from "../DAO/userDAO.js"
import cartServices from "../services/CartServices.js"
import Services from "./Services.js"
import {createHash,isValidPassword} from '../utils.js'

const secretKey = process.env.SECRET_KEY;

class UserService extends Services{
    constructor(){
        super(userDAO)
    }
    async getByEmail(email){
        try {
            return userDAO.getByEmail(email)
        } catch (error) {
            throw new Error(`Not exist user with email: ${email}`)
        }
    }
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
            
            const newCart = await cartServices.newCart()
            const passwordHash = createHash(password)
            
            const newUser = {
                first_name:first_name,
                last_name: last_name,
                email:email,
                age:age,
                username: username,
                password: passwordHash,
                cart: newCart._id,
            }
            
            return await userDAO.create(newUser)
        } catch (error) {
            throw new Error(`Error to create User: ${error}`)
        }
    }
    async login (email,password){
        try {
            const userDb = await userDAO.findByEmail(email)
            if(!userDb){
                throw new Error(`User: ${username} don't exist`)
                return
            }

            const validPassword = isValidPassword (password,userDB) 
            if(!validPassword){
                throw new Error(`User: password incorrect`)
                return
            }
            
            return this.generateToken(userDB)
        } catch (error) {
            throw new Error(`Error to login User: ${error}`)
        }
    }
}

export const userService = new UserService(userDAO)