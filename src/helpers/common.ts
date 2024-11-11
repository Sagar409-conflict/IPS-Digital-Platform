import { Op } from 'sequelize'
import userService from '../services/user.service'

export const generateOtp = async () => {
  let min = 100000
  let max = 999999
  const otp_expire_time = new Date(Date.now() + 60 * 60 * 1000) // 60 minutes
  return {
    otp: Math.floor(Math.random() * (max - min + 1)) + min,
    otp_expire_time,
  }
}

export const validateOtpExpiration = async (email: string) => {
  return await userService.findOne({
    where: {
      email,
      otp_expire_time: {
        [Op.gt]: new Date(), // Checks if otpExpiration is greater than the current time
      },
    },
    raw: true,
  })
}
export const validateOtp = async (email: string, otp: string) => {
  return await userService.findOne({
    where: {
      email,
      otp,
      otp_expire_time: {
        [Op.gt]: new Date(), // Checks if otpExpiration is greater than the current time
      },
    },
    raw: true,
  })
}

export const generateRandomString = async (length: number): Promise<string> => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters[randomIndex]
  }

  return result
}

export const metaDataForPaginations = async (page: number, limit: number, count: number) => {
  return {
    currentPage: Math.abs(page),
    // currentLimit: Math.abs(limit),
    totalPages: Math.ceil(count / limit),
    totalItems: count,
  }
}

export const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
