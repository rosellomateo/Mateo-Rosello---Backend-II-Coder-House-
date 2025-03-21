import jwt from "jsonwebtoken"
import "dotenv/config"

import userDAO from "../DAO/Mongo/userDAO.mongo.js"
import cartServices from "../services/CartServices.js"
import Services from "./Services.js"
import {createHash,isValidPassword} from '../utils.js'
import { recoveryPassword } from "../email/EmailServices.js"

const secretKey = process.env.SECRET_KEY

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
        const {_id,first_name,last_name,email,age,username,password,cart,role} = user
        
        const payload ={
            sub: _id,
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

            let userDb = await userDAO.getByFilter({email})
            if(userDb) return new Error(`User with email: ${email} already exists.`)

            userDb = await userDAO.getByFilter({username})
            if(userDb) 
                return new Error(`User with username: ${username} already exists.`)
            
            const newCart = await cartServices.newCart()
            
            const passwordHash = await createHash(password)

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
    
    async login (user){
        try {
            const {email,password} = user

            if (!email || !password ) 
                throw new Error(`fields incomplete`)

            const userDB = await userDAO.getByEmail(email)

            if(!userDB){
                throw new Error(`User: ${username} don't exist`)
            }

            const validPassword = isValidPassword (password,userDB) 
            if(!validPassword){
                throw new Error(`User: password incorrect`)
            }
            
            return this.generateToken(userDB)
        } catch (error) {
            throw new Error(`Error to login User: ${error}`)
        }
    }

    async forgotPassword(email){
        try {
            const user = await userDAO.getByEmail(email)
            const token = jwt.sign(
                {email: user.email},
                secretKey,
                {expiresIn: "1h"}
            )

            await recoveryPassword(email,token)
            return
        }catch (error) {
            throw new Error(`Error to recover Password: ${error}`)
        }
    }

    async resetPassword(token,password){
        try {
            const email = jwt.verify(token,secretKey).email

            const userDb = await userDAO.getByEmail(email)
            if(!userDb) 
                throw new Error(`User with email: ${email} don't exist`)

            const passwordHash = await createHash(password)
            userDb.password = passwordHash
            
            return await userDAO.update(userDb)
        } catch (error) {
            throw new Error(`Error to reset Password: ${error}`)
        }
    }
}

const userService = new UserService(userDAO)

export default userService