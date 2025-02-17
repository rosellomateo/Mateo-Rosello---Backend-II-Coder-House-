import userServices from "../services/userServices.js"

class UserController{
    constructor(){
        services = userServices
    }

    async register (req,res,next) =>{
        try {
            const user = await this.service.register(req.body)
            res.json(user)
        } catch (error) {
            next(error)
        }
    }
    
    async login (req,res,next) => {
        try {
            const token = await this.service.login(req.body)
            res
                .cookie('token',token,{httpOnly: true})
                .json({message: `User Login`, token})
        } catch (error) {
            next(error)
        }
    }

    async privateData (req,res,next) =>{
        try {
           const user =  
        } catch (error) {
            
        }
    }
}

const userController = new UserController()
export default userController