import { Request, Response } from 'express'
import { badRequest, internalServer, success } from '../helpers/response'
import { statusCode } from '../config/statucCode'
import { ICreateUser, IUser } from '../types/user.interface'
import { LANGUAGE_CODE } from '../helpers/constant'
import userService from '../services/user.service'
import { encrypt } from '../helpers/encrypt'
import { generateToken, verifyUser } from '../middleware/userAuth'
import { generateOtp, validateOtp, validateOtpExpiration } from '../helpers/common'
import mailTemplateService from '../services/mail_template.service'

class AuthController {
  /****************************************
   * REST API endpoint for registser user
   * @param req
   * @param res
   * @returns
   ***************************************/
  async register(req: Request, res: Response) {
    const languageCode: string = (req.headers.languagecode as string) ?? LANGUAGE_CODE.EN
    try {
      const userPayload: ICreateUser = req.body
      // Encrypt a password & store it into encrypted manner
      userPayload.password = await encrypt(userPayload.password)
      // Find email is exist or not
      const user = await userService.findOneByEmail(userPayload.email)
      if (user) {
        return badRequest(res, languageCode, 'EMAIL_EXIST', req.body)
      }
      //Store user data into the database
      const queryResponse = await userService.create(userPayload)
      return success(res, languageCode, statusCode.SUCCESS, 'ACCOUNT_CREATED', queryResponse)
    } catch (error) {
      return internalServer(res, languageCode, req.body, undefined, (error as Error).message)
    }
  }

  /****************************************
   * REST API endpoint for login user
   * @param req
   * @param res
   * @returns
   ***************************************/
  async login(req: Request, res: Response) {
    const languageCode: string = (req.headers.languagecode as string) ?? LANGUAGE_CODE.EN
    try {
      // Check credentials in authorization from Header
      if (req.headers.authorization?.split(' ')[1] === '')
        return badRequest(res, languageCode, 'REQUIRED_PARAMETERES')

      // Find actual credentials from base64
      const base64Credentials = req.headers.authorization?.split(' ')[1] ?? ''
      const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
      const requestData = credentials.split(':')

      // Pure & Clean data is here
      const email = requestData[0]
      const password = requestData[1]
      let isValidUser = await verifyUser(email, password)

      // Check user is valid is not
      if (isValidUser) {
        if (isValidUser.status) {
          // User is active then generate a token for the user
          let token = await generateToken(isValidUser)
          const user = await userService.findOneByEmail(email)
          return success(res, languageCode, statusCode.SUCCESS, 'LOGIN_SUCCESS', {
            ...user,
            token,
          })
        } else {
          return badRequest(res, languageCode, 'USER_INACTIVE')
        }
      } else {
        return badRequest(res, languageCode, 'USER_NOT_EXIST')
      }
    } catch (error) {
      return internalServer(res, languageCode, req.body, undefined, (error as Error).message)
    }
  }

  async forgotPassword(req: Request, res: Response) {
    const languageCode: string = (req.headers.languagecode as string) ?? LANGUAGE_CODE.IT
    try {
      const { email } = req.body
      const { otp, otp_expire_time } = await generateOtp()
      // let emailContent = getForgotPasswordEmail(otp)
      // await sendEmail(body.email, 'Password Reset Request - Your OTP for PICKUP TIME', emailContent)
      const updateRecord = (await userService.updateViaEmail(email, { otp, otp_expire_time }))[0]

      if (!updateRecord)
        return internalServer(res, languageCode, req.body, undefined, 'UNABLE_TO_UPDATE')

      const isExistUser = await userService.findOneByEmail(email)

      if (!isExistUser) return badRequest(res, languageCode, 'USER_NOT_EXIST')
      // Send mail
      const mailBody = {
        email: isExistUser.email,
        first_name: isExistUser.first_name,
        last_name: isExistUser.last_name,
        otp,
      }
      await mailTemplateService.sendFogotPasswordMail(mailBody)
      return success(res, languageCode, statusCode.SUCCESS, 'FORGOT_PASWORD_EMAIL_SENT_SUCESS', {
        otp,
      })
    } catch (error) {
      console.error('🐛 ERROR 🐛', error)
      return internalServer(res, languageCode, req.body, undefined, (error as Error).message)
    }
  }

  async verifyOTP(req: Request, res: Response) {
    const languageCode: string = (req.headers.languagecode as string) ?? LANGUAGE_CODE.IT

    try {
      const { email, otp } = req.body
      const isExistUser = await userService.findOneByEmail(email)

      if (!isExistUser) return badRequest(res, languageCode, 'USER_NOT_EXIST')

      let otpExpiration = await validateOtpExpiration(email)
      if (!otpExpiration) return badRequest(res, languageCode, 'OTP_EXPIRED')
      let user = await validateOtp(email, otp)
      if (!user) return badRequest(res, languageCode, 'INVALID_OTP')

      const recordUpdate = (
        await userService.updateViaEmail(email, {
          otp: null,
          otp_expire_time: null,
        })
      )[0]

      if (!recordUpdate)
        return internalServer(res, languageCode, req.body, undefined, 'UNABLE_TO_UPDATE')

      return success(res, languageCode, statusCode.SUCCESS, 'OTP_VALIDATE_SUCCESSFULLY', null)
    } catch (error) {
      console.error('🐛 ERROR 🐛', error)
      return internalServer(res, languageCode, req.body, undefined, (error as Error).message)
    }
  }

  async resendOTP(req: Request, res: Response) {
    const languageCode: string = (req.headers.languagecode as string) ?? LANGUAGE_CODE.IT
    try {
      const { email } = req.body
      const { otp, otp_expire_time } = await generateOtp()

      const isExistUser = await userService.findOneByEmail(email)
      if (!isExistUser) return badRequest(res, languageCode, 'USER_NOT_EXIST')

      const updateRecord = (await userService.updateViaEmail(email, { otp, otp_expire_time }))[0]

      if (!updateRecord)
        return internalServer(res, languageCode, req.body, undefined, 'UNABLE_TO_UPDATE')

      // Send mail
      const mailBody = {
        email: isExistUser.email,
        first_name: isExistUser.first_name,
        last_name: isExistUser.last_name,
        otp,
      }
      await mailTemplateService.sendResendOTPMail(mailBody)
      return success(res, languageCode, statusCode.SUCCESS, 'OTP_RESEND_SUCCESS', { otp })
    } catch (error) {
      console.error('🐛 ERROR 🐛', error)
      return internalServer(res, languageCode, req.body, undefined, (error as Error).message)
    }
  }

  async resetPassword(req: Request, res: Response) {
    const languageCode: string = (req.headers.languagecode as string) ?? LANGUAGE_CODE.IT

    try {
      const { email, password } = req.body
      const isExistUser = await userService.findOneByEmail(email)
      if (!isExistUser) return badRequest(res, languageCode, 'USER_NOT_EXIST', req.body)

      const encryptedPassword = await encrypt(password)
      const updateRecord = (
        await userService.updateViaEmail(email, { password: encryptedPassword })
      )[0]

      if (!updateRecord)
        return internalServer(res, languageCode, req.body, undefined, 'UNABLE_TO_UPDATE')

      // Send mail
      const mailBody = {
        email: isExistUser.email,
        first_name: isExistUser.first_name,
        last_name: isExistUser.last_name,
      }
      await mailTemplateService.sendPasswordResetACKEmail(mailBody)
      return success(res, languageCode, statusCode.SUCCESS, 'PASSWORD_RESET_SUCCESS', null)
    } catch (error) {
      console.error('🐛 ERROR 🐛', error)
      return internalServer(res, languageCode, req.body, undefined, (error as Error).message)
    }
  }
}

const authController = new AuthController()
export default authController
