import bcrypt from 'bcrypt'

export const error500 = (res,error) => {
    console.error(`error utils: ${error}`)
    res.setHeader('Content-Type', 'application/json')
    return res.status(500).json({ status: "error", error: `error ${error}` })
}

export const createHash = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        return hash
    } catch (error) {
        throw new Error(`error al encriptar la contraseña: ${error}`)
    }
}

export const isValidPassword = (password, user) => {
    try {
        return bcrypt.compareSync(password, user.password)
    } catch (error) {
        throw new Error(`error al validar contraseña: ${error}`)
    }
}
 