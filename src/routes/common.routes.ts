import { Router } from 'express'
import commonController from '../controllers/common.controller'

import { AuthGuard, checkRole } from '../middleware/auth.middleware'
import { ROLES } from '../helpers/constant'
import { validate } from '../middleware/validator.middleware'

const commonRoutes = Router()

commonRoutes.get('/home', commonController.mobileHomeScreen)
commonRoutes.get(
  '/rejection-reasons',
  AuthGuard,
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORGANIZER]),
  validate('getRejactionReasons'),
  commonController.getRejectionReasonsList
)
commonRoutes.put(
  '/modify-status',
  AuthGuard,
  checkRole([ROLES.SUPER_ADMIN]),
  validate('updateStatus'),
  commonController.modifyStatus
)
commonRoutes.put(
  '/update-status/:module/:id',
  AuthGuard,
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORGANIZER]),
  validate('statusUpdate'),
  commonController.statusUpdate
)

export default commonRoutes
