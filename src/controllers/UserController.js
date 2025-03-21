import userServices from "../services/userServices.js"
import UserReqDTO from "../DTO/UserDTO.REQ.js"
import UserResDTO from "../DTO/UserDTO.RES.js"
class UserController{
    async register (req,res,next){
        try {
            const body = req.body
            const {first_name,last_name,email,age,username,password} = body
            if (!first_name || !last_name || !email || !age || !username || !password ){
                res.status(404).send({message: `fields incomplete`})
                return
            }
            const userDTO = new UserReqDTO(body)
            const resposne = await userServices.register(userDTO)
            res.json(resposne)
        } catch (error) {
            next(error)
        }
    }
    
    async login (req,res,next){
        try {
            const body = req.body
            
            const {email,password} = body
            if (!email || !password ){
                res.status(404).send({message: `fields incomplete`})
                return
            }

            const userDTO = new UserReqDTO(body)
            const token = await userServices.login(userDTO)
            res
                .cookie('token',token,{httpOnly: true})
                .json({message: `User Login`, token})
        } catch (error) {
            next(error)
        }
    }

    async privateData (req,res,next){
        try {
            if(!req.user){
                res.status(404).send({message:`User don't exist`})
                return
            }
                
            res.json({user: req.user})
        } catch (error) {
            next(error)
        }
    }

    async forgotPassword (req,res,next){
        try {
            const {email} = req.body
            const user = await userServices.getByEmail(email)

            if(!user){
                console.log("no existe el usuario")
                res.status(404).send({message:`User with email: ${email} don't exist`})
                return
            }

            await userServices.forgotPassword(email)
            res.status(200).json({message: `Email send`})
        } catch (error) {
            next(error)
        }
    }

    async resetPassword (req,res,next){
        try {
            const token = req.params.token
            const {password} = req.body
            if(!password){
                res.status(404).send({message: `password incomplete`})
                return
            }
            await userServices.resetPassword(token,password)
            res.status(200).json({message: `Password change`})
        } catch (error) {
            next(error)
        }
    }
}

const userController = new UserController()

export default userController