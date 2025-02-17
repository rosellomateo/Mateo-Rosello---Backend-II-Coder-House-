const webSocketMiddleware = (websocket) =>{
    return (req, res, next) => {   
        req.io = websocket
        next() 
    }
}

export default webSocketMiddleware