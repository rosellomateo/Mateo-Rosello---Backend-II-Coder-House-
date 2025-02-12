const serverHTTP = (app,PORT) =>{
    return app.listen(PORT,()=>{console.log("Server start")})
}

export default serverHTTP