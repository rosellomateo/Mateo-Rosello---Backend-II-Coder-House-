import passport from "passport"
import userService from "../services/userServices.js"
import jwt, { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt"
import "dotenv/config"


const { fromExtractors, fromAuthHeaderWithScheme, fromAuthHeaderAsBearerToken } = ExtractJwt

const cookieExtractor = (req) =>{
    let token = null

    if (req && req.cookies){
        token = req.cookies['token']
    }
    return token
}

const initializePassport = () => {
    passport.use('current', new JwtStrategy({
        jwtFromRequest: fromExtractors([cookieExtractor]),
        secretOrKey: process.env.SECRET_KEY
    },async (jwt_payload,done)=>{
        try {
            console.log(jwt_payload.sub)

            if (!jwt_payload.sub) {
                console.error("Error: el token no contiene 'sub'");
                return done(null, false, { message: "Token inválido" });
            }
            
            const user = await userService.getById(jwt_payload.sub)
            if (user)
                done(null, user);
            else 
                done(null, false)
        } catch (error) {
            throw new Error(error)
        }
        
        
    }))

    passport.serializeUser((user,done)=>{
        done(null,user)
    })

    passport.deserializeUser(async(id,done)=>{
        const user = await userService.getById(id)
        done(null,user)
    })
}

export default initializePassport