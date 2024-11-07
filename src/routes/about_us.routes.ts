import { Router } from 'express'
import aboutUsController from '../controllers/about_us.controller'

import { AuthGuard, checkRole } from '../middleware/auth.middleware'
import { ROLES } from '../helpers/constant'
import { validate } from '../middleware/validator.middleware'

const aboutUsRoutes = Router()

aboutUsRoutes.post(
  '/',
  AuthGuard,
  checkRole([ROLES.SUPER_ADMIN]),
  validate('createAboutUs'),
  aboutUsController.create
)

// aboutUsRoutes.get('/', aboutUsController.getAll)

export default aboutUsRoutes
