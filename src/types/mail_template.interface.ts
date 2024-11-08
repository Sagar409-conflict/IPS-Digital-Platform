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
}
export interface ISendPublishedemail {
  submittedAt?: Date
  publishedAt?: Date
  email: string
  first_name: string
  last_name: string
  newsTitle?: string
  status?: string
}

export interface ISendRejectedemail {
  email: string
  first_name: string
  last_name: string
  newsTitle?: string
  submittedAt?: Date
  publishedAt?: Date
  status?: string
}
