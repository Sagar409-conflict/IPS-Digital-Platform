import { sendMail } from '../helpers/mail'
import sendForgotPasswordTemplate from '../templates/frogot_password.template'
import sendNewOrganizerTemplate from '../templates/new_organizer.template'
import sendPasswordResetACKTemplate from '../templates/password_reset_ack.template'
import sendResendOTPTemplate from '../templates/resend_otp.template'
import SendApprovalaTemplate from '../templates/approval_email.template'
import SendPublishedTemplate from '../templates/published_email.template'
import SendRejectedTemplate from '../templates/rejected_email.template'
import {
  ISendForgotPassword,
  ISendOrganizerCredentials,
  ISendPasswordResetSucessful,
  ISendApprovalemail,
  ISendPublishedemail,
  ISendRejectedemail,
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

  async sendPendingApprovalEmail(body: ISendApprovalemail) {
    try {
      const emailCheckData = {
        to: body?.email,
        subject: 'Pending News Submission: Publish or Reject',
        html: SendApprovalaTemplate.sendApprovalEmail(body),
      }
      const isMailSent = await sendMail(emailCheckData)
      if (!isMailSent) {
        console.error('Failed to send email.')
        return isMailSent
      }
    } catch (error) {
      console.log('Failed to send email.', error)
      throw error
    }
  }

  async sendPublishedEmail(body: ISendPublishedemail) {
    try {
      const emailCheckData = {
        to: body?.email,
        subject: 'for news published email',
        html: SendPublishedTemplate.sendPublishedEmail(body),
      }
      const isMailSent = await sendMail(emailCheckData)
      if (!isMailSent) {
        console.error('Failed to send email.')
        return isMailSent
      }
    } catch (error) {
      console.log('Failed to send email.', error)
      throw error
    }
  }

  async sendRejectedEmail(body: ISendRejectedemail) {
    try {
      console.log(body)
      const emailCheckData = {
        to: body?.email,
        subject: 'for news approvel or rejection',
        html: SendRejectedTemplate.sendRejectedEmail(body),
      }
      const isMailSent = await sendMail(emailCheckData)
      if (!isMailSent) {
        console.error('Failed to send email.')
        return isMailSent
      }
    } catch (error) {
      console.log('Failed to send email.', error)
      throw error
    }
  }
}

const mailTemplateService = new MailTemplateService()

export default mailTemplateService
