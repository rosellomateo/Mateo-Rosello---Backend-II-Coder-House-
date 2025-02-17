import userServices from "../services/userServices.js"

class UserController{
    async register (req,res,next){
        try {
            console.log(req.body)
            const user = await userServices.register(req.body)
            res.json(user)
        } catch (error) {
            next(error)
        }
    }
    
    async login (req,res,next){
        try {
            const token = await userServices.login(req.body)
            res
                .cookie('token',token,{httpOnly: true})
                .json({message: `User Login`, token})
        } catch (error) {
            next(error)
        }
    }

    async privateData (req,res,next){
        try {
            if(!req.user)
                throw new Error(`Not access to User Data`)
            res.json({user: req.user})
        } catch (error) {
            next(error)
        }
    }
}

const userController = new UserController()

export default userController