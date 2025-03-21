import passport from 'passport'
import jwt from 'jsonwebtoken'
import { secretKey } from './secretKey.js'


export const passportCall = (strategy) => {
    return async(req, res, next)=>{
        passport.authenticate(strategy, (err, user, info)=>{
            if(err){
                return next(err)
            }
                
            if(!user){
                return res.redirect('/login')
            } 
            req.user = user
            next()
        })(req, res, next)
    }
}

export const isAdmin = () => {
    return async (req, res, next) => {
      try {
        const token = req.cookies.token
        
        if (!token) {
            return res.status(401).json({ error: 'No token provided' })
        }
  
        const user = jwt.verify(token, secretKey)
        console.log(user)
        if (user.role === 'admin') {
            next()
        } else {
            return res.status(403).json({ error: 'Access denied: not admin' })
        }
      } catch (error) {
        console.error('Auth error:', error.message)
        return res.status(401).json({ error: 'Invalid or expired token' })
      }
    }
}
