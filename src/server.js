import express from "express"
import handlebars from "express-handlebars"
import session from "express-session"
import MongoStore from "connect-mongo"
import cookieParser from "cookie-parser"
import passport from "passport"

import ProductRouter from "./routers/ProductRouter.js"
import CartRouter from "./routers/CartRouter.js"
import ViewsRouter from "./routers/ViewsRouter.js"
import UserRouter from './routers/UserRouter.js'

import mongoConection from "./config/mongoDb.js"
import initializePassport from "./config/passportConfig.js"

import "dotenv/config"
import serverHTTP from "./servers/serverHTTP.js"
import serverWebSocket from "./servers/serverWebSocket.js"
import errorHandler from "./middlewares/errorHandler.js"

import webSocketMiddleware from './middlewares/WebSocketMiddleware.js'

const app = express()
const sessionConfig = {
    store:MongoStore.create({
        mongoUrl: process.env.DB_URL,
        crypto:{
            secret: process.env.SECRET_KEY
        },
        ttl: 3600 // los documentos 1hr de vida
    }),
    secret: process.env.SECRET_KEY,
    saveUninitialized: true,
    resave: false,
    cookie: {
        maxAge: 60000,
      },
}

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(cookieParser())
app.use(session(sessionConfig))
initializePassport()
app.use(passport.initialize())
app.use(passport.session())


app.use(errorHandler)

app.use(express.static("./src/public"))
app.engine("handlebars",handlebars.engine({helpers: {multiply:(a, b) => a * b,},}))
app.set("view engine", "handlebars")
app.set("views", "./src/views")

const server = serverHTTP(app,process.env.PORT) // Server HHTP
const websocket = serverWebSocket(server) //Server Websocket

mongoConection(process.env.DB_URL,process.env.DB_NAME) //Connection to MongoDB Atlas

app.use("/api/products",ProductRouter)
app.use("/api/carts",CartRouter)
app.use("/api/sessions",UserRouter)
app.use("/",webSocketMiddleware(websocket),ViewsRouter)