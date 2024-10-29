import nodemailer from 'nodemailer'
import { CONFIG } from '../config/config'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: CONFIG.ADMIN_EMAIL,
    pass: CONFIG.ADMIN_PASS,
  },
})
interface MailData {
  to: string
  subject: string
  text?: string
  html?: string
}
export const sendMail = async (data: MailData): Promise<boolean> => {
  const mailOptions = {
    from: `University of Macerata <${CONFIG.ADMIN_EMAIL}>`,
    ...data,
  }

  try {
    const result = await transporter.sendMail(mailOptions)
    return result ? true : false
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}
