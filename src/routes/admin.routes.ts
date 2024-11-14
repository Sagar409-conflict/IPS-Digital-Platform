import { Router } from 'express'
import authController from '../controllers/auth.controller'
import { validate } from '../middleware/validator.middleware'
import { AuthGuard } from '../middleware/auth.middleware'

const authRoutes = Router()

/**
 * User Routes
 */
authRoutes.post('/', validate('register'), authController.register)

authRoutes.post('/login', authController.login)
authRoutes.post('/forgot-password', authController.forgotPassword)
authRoutes.post('/verify-reset-password', authController.verifyOTP)
authRoutes.post('/resend-otp', authController.resendOTP)
authRoutes.post('/reset-password', validate('resetPassword'), authController.resetPassword)
authRoutes.put(
  '/change-password',
  AuthGuard,
  validate('changePassword'),
  authController.changePassword
)
authRoutes.put(
  '/update-profile',
  AuthGuard,
  validate('updateProfile'),
  authController.updateProfile
)

export default authRoutes
