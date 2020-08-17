const express = require("express")
const helmet = require('helmet')
const cors = require("cors")
const bcryptjs = require("bcryptjs")
const session = require("express-session")
const KnexSessionStore = require("connect-session-knex")(session)
const usersRouter = require("../users/users-router")
const authRouter = require("../auth/auth-router")
const dbConnection = require("../database/connection")
const authed = require("../auth/auth-middleware")
const server = express()



const sessionConfiguration = {
    name: "CrazyLegsMan",
    secret: "Super crazy secret that no one will ever guess",
    cooke: {
        maxage: 1000*60*10,
        secure: process.env.COOKIE_SECURE || false,
        httpOnly: true,
    },
    resave: false,
    saveUninitialized: true, // turn off in production 
    store: KnexSessionStore({
        knex:dbConnection,
        tablename: "sessions", 
        sidfieldname: 'sid',
        createtable: true,
        clearInterval: 1000 * 60 * 30
    })
}


server.use(session(sessionConfiguration))
server.use(helmet())
server.use(express.json())
server.use(cors())

server.use("/api/users", authed, usersRouter)
server.use("/api/auth", authRouter)


module.exports = server