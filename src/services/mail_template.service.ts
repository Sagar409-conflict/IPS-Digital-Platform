import { sendMail } from '../helpers/mail'
import sendForgotPasswordTemplate from '../templates/frogot_password.template'
import sendNewOrganizerTemplate from '../templates/new_organizer.template'
import sendPasswordResetACKTemplate from '../templates/password_reset_ack.template'
import sendResendOTPTemplate from '../templates/resend_otp.template'
import {
  ISendForgotPassword,
  ISendOrganizerCredentials,
  ISendPasswordResetSucessful,
} from '../types/mail_template.interface'

class MailTemplateService {
  async sendNewOrganizerMail(body: ISendOrganizerCredentials) {
    try {
      const emailCheckData = {
        to: body?.email,
        subject: 'Your Orgnizer Account Details',
        html: sendNewOrganizerTemplate.sendNewOrganizerEmail(body),
      }
      const isMailSent = await sendMail(emailCheckData)
      if (!isMailSent) {
        console.error('Failed to send email.')
        return isMailSent
      }
      return isMailSent
    } catch (error) {
      console.error('Failed to send email.', error)
      throw error
    }
  }

  async sendFogotPasswordMail(body: ISendForgotPassword) {
    try {
      const emailCheckData = {
        to: body?.email,
        subject: 'One-Time Password for Password Recovery',
        html: sendForgotPasswordTemplate.sendNewOrganizerEmail(body),
      }
      const isMailSent = await sendMail(emailCheckData)
      if (!isMailSent) {
        console.error('Failed to send email.')
        return isMailSent
      }
      return isMailSent
    } catch (error) {
      console.error('Failed to send email.', error)
      throw error
    }
  }

  async sendResendOTPMail(body: ISendForgotPassword) {
    try {
      const emailCheckData = {
        to: body?.email,
        subject: 'Your OTP Code for Verification',
        html: sendResendOTPTemplate.sendResendOTPEmail(body),
      }
      const isMailSent = await sendMail(emailCheckData)
      if (!isMailSent) {
        console.error('Failed to send email.')
        return isMailSent
      }
      return isMailSent
    } catch (error) {
      console.error('Failed to send email.', error)
      throw error
    }
  }

  async sendPasswordResetACKEmail(body: ISendPasswordResetSucessful) {
    try {
      const emailCheckData = {
        to: body?.email,
        subject: 'Password Reset Successful',
        html: sendPasswordResetACKTemplate.sendPasswordResetACKEmail(body),
      }
      const isMailSent = await sendMail(emailCheckData)
      if (!isMailSent) {
        console.error('Failed to send email.')
        return isMailSent
      }
      return isMailSent
    } catch (error) {
      console.error('Failed to send email.', error)
      throw error
    }
  }
}

const mailTemplateService = new MailTemplateService()

export default mailTemplateService
