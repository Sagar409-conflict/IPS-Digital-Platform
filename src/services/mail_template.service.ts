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
import SendPendingApprovalaTemplate from '../templates/pending_event.template'

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
        subject: `Notification: Your ${body.type} Submission Has Been Published`,
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
      const emailCheckData = {
        to: body?.email,
        subject: `Notification: ${body.type} Approval or Rejection Status Update`,
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

  async sendEventPendingApprovalEmail(body: ISendApprovalemail) {
    try {
      const emailCheckData = {
        to: body?.email,
        subject: 'Pending Event submission: Publish or Reject',
        html: SendPendingApprovalaTemplate.sendPendingApprovalEmail(body),
      }
      const isMailSent = await sendMail(emailCheckData)
      if (!isMailSent) {
        console.error('Failed to send email')
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
