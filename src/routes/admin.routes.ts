import { Router } from 'express'
import authController from '../controllers/auth.controller'
import { validate } from '../middleware/validator.middleware'
// import {
//   invitationGuard,
//   AuthGuard,
//   checkRole,
//   checkSubscriptionStatus,
// } from '../../middleware/auth.middleware'

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

// For Admin Plan Purchase Login
// authRoutes.post('/adminlogin', validate('login'), authController.login)

/**
 * Get all users list based on search parameters, and attach pagination data
 */
// authRoutes.get(
//   '/',
//   AuthGuard,
//   checkRole([ROLES.SUPER_ADMIN]),
//   validate('getUsers'),
//   authController.getAllUsers
// )
/**
 * Delete a specified user(action will be performed by an SuperAdmin)
 */
// authRoutes.delete(
//   '/:id',
//   AuthGuard,
//   checkRole([ROLES.SUPER_ADMIN]),
//   validate('id'),
//   authController.deleteUser
// )

/**
 * Reset Password
 */
// authRoutes.put(
//   '/reset-password',
//   AuthGuard,
//   validate('resetPassword'),
//   authController.resetPassword
// )
/**
 * Update an existing user information(action will be performed by an SuperAdmin)
 */
// authRoutes.put(
//   '/:id',
//   AuthGuard,
//   checkRole([ROLES.SUPER_ADMIN]),
//   validate('updateUsers'),
//   authController.updateUser
// )

/**
 * While registering a user with "Admin" role, we will have to send an email to them with sepcified credentials
 */
// authRoutes.post(
//   '/user/invite',
//   validate('createUserInvitation'),
//   AuthGuard,
//   authController.createInvitationForAdmin
// )

/**
 * While accessing the portal first time from "Admin" role user has to change the password from the given access portal password
 */
// authRoutes.post(
//   '/accept-invitation',
//   validate('acceptUserInvitation'),
//   invitationGuard,
//   authController.updatePassword
// )

/**
 * Forgot Password feataure route
 */
// authRoutes.post('/forgot-password', authController.forgotPassword)

// authRoutes.get('/:id', AuthGuard, authController.getById)
export default authRoutes
