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
