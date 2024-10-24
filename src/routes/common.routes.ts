import { Router } from 'express'
import commonController from '../controllers/common.controller'

import { AuthGuard, checkRole } from '../middleware/auth.middleware'
import { ROLES } from '../helpers/constant'

const commonRoutes = Router()

commonRoutes.put(
  '/update-status/:module/:id',
  AuthGuard,
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORGANIZER]),
  commonController.statusUpdate
)

export default commonRoutes
