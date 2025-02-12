import bcrypt from 'bcrypt'

export const error500 = (res,error) => {
    console.error(`error utils: ${error}`)
    res.setHeader('Content-Type', 'application/json')
    return res.status(500).json({ status: "error", error: `error ${error}` })
}

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password)

export default {error500,createHash,isValidPassword}