export interface IUser {
  id: string
  role: string
  profile_image?: string
  first_name: string
  last_name: string
  email: string
  password: string
  country_code: string
  mobile_number: string
  otp?: number | null
  otp_expire_time?: Date | null
  status: string
  createdAt: Date
  updatedAt: Date
}

export interface ICreateUser {
  id: string
  role: string
  profile_image?: string
  first_name: string
  last_name: string
  email: string
  password: string
  country_code: string
  mobile_number: string
  otp?: number | null
  otp_expire_time?: Date | null
  status?: string
  createdAt?: Date
  updatedAt?: Date
}
export interface IUserResponse {
  id: string
  role: string
  first_name: string
  last_name: string
  email: string
  country_code: string
  mobile_number: string
  status: string
  createdAt: Date
  updatedAt: Date
}
export interface IUserTokenPayload {
  id: string
  first_name: string
  last_name: string
  email: string
  role: string
}

export interface ProfileImageStatus {
  profile_image: boolean
}
