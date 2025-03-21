import 'dotenv/config'
import { createTransport } from 'nodemailer'
import { templateHtml } from './template.js'
import { format } from 'path'

export const transporter = createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASS
    }
})

export const recoveryPassword = async (email, token) => {
    try {
        const link = `http://localhost:8080/reset-password/${token}`
        
        const mail = {
            from: process.env.GMAIL,
            to: email,
            subject: 'Recover Password',
            html:`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Recuperación de Contraseña</title><style>body{font-family:Arial,sans-serif;background-color:#f4f4f4;margin:0;padding:0}.email-container{max-width:600px;margin:20px auto;background:#ffffff;padding:20px;border-radius:8px;box-shadow:0px 4px 10px rgba(0,0,0,0.1);text-align:center}h2{color:#333}p{font-size:16px;color:#555;line-height:1.5}.reset-button{display:inline-block;padding:12px 20px;margin-top:20px;background:#007BFF;color:#ffffff;text-decoration:none;border-radius:5px;font-size:16px;font-weight:bold}.reset-button:hover{background:#0056b3}.footer{margin-top:20px;font-size:12px;color:#777}</style></head><body><div class="email-container"><h2>Recuperación de Contraseña</h2><p>Hemos recibido una solicitud para restablecer tu contraseña.</p><p>Haz clic en el siguiente enlace para cambiar tu contraseña:</p><a href="${link}" class="reset-button">Restablecer Contraseña</a><p>Este enlace expirará en 1 hora.</p><p class="footer">Si no solicitaste este cambio, puedes ignorar este mensaje.</p></div></body></html>`,
        }

        await transporter.sendMail(mail)
        console.log(`Email send: ${email}`)
    } catch (error) {
        throw new Error(error)
    }
}