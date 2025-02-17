import passport from "passport"
import { ExtractJwt,Strategy as JwtStrategy } from "passport-jwt"
import "dotenv/config"

import {userService} from "../services/userServices.js"

const verifyToken = async(jwt_payload,done) =>{
    if(!jwt_payload)
        return done(null,false,{message: "User doesn't exist"})
    
    return done(null,jwt_payload)
}

const cookieExtractor = (req) => {
    return req.cookies.token
}

const strategyCookiesConfig = {
  jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
  secretOrKey: process.env.SECRET_KEY,
}

const serialize = (user,done) =>{
    try {
        return done(null,user._id)  
    } catch (error) {
        return done(error)
    }
}

const deserialize = async (id, done) =>{
    try {
        const user = await userService.getById(id)
        return done(null,user)
    } catch (error) {
        return done(error)
    }
}


passport.use('current', new JwtStrategy(strategyCookiesConfig,verifyToken))
passport.serializeUser(serialize)
passport.deserializeUser(deserialize)