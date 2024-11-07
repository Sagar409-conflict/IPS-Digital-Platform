import { Router } from 'express'
import aboutUsController from '../controllers/about_us.controller'

import { AuthGuard, checkRole } from '../middleware/auth.middleware'
import { ROLES } from '../helpers/constant'
import { validate } from '../middleware/validator.middleware'

const aboutUsRoutes = Router()

aboutUsRoutes.put(
  '/:id',
  AuthGuard,
  checkRole([ROLES.SUPER_ADMIN]),
  validate('updateAboutUs'),
  aboutUsController.update
)
aboutUsRoutes.get('/', aboutUsController.getAll)
aboutUsRoutes.get('/:id', aboutUsController.get)
aboutUsRoutes.delete(
  '/remove-banner-image/:id',
  AuthGuard,
  checkRole([ROLES.SUPER_ADMIN]),
  validate('id'),
  aboutUsController.delete
)
// aboutUsRoutes.get('/', aboutUsController.getAll)

export default aboutUsRoutes
