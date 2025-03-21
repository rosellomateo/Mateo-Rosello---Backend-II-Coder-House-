export const validateLogin = (req, res, next) =>{
    if(req.session.info && req.session.info.loggedIn) next()
    else res.status(401).json({msg: 'Unauthorized'})
}

export const isAdmin = (req, res, next) =>{
    if(req.session.info && req.session.info.admin) next()
    else res.status(403).json({msg: 'solo usuarios administradores'})
}
