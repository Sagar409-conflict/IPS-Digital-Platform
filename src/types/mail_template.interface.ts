import { ICreateRejectReasons } from './reject_reasons.interface'

export interface ISendOrganizerCredentials {
  email: string
  first_name: string
  last_name: string
  password: string
}

export interface ISendForgotPassword {
  email: string
  first_name: string
  last_name: string
  otp: number
}
export interface ISendResendOTP {
  email: string
  first_name: string
  last_name: string
  otp: number
}
export interface ISendPasswordResetSucessful {
  email: string
  first_name: string
  last_name: string
}
export interface ISendApprovalemail {
  email: string
  admin_first_name: string
  admin_last_name: string
  first_name: string
  last_name: string
  title: string
  organizer_email: string
  submitted_date?: string
}
export interface ISendPublishedemail {
  submittedAt?: string
  publishedAt?: string
  email: string
  first_name: string
  last_name: string
  title?: string
  status?: string
  type?: string
}

export interface ISendRejectedemail {
  email: string
  first_name: string
  last_name: string
  title?: string
  submittedAt?: string
  publishedAt?: string
  status?: string
  reason?: string[]
  type?: string
}
export interface ISendContactInquiry {
  full_name: string
  email: string
}
