import { Router } from 'express'
import EventController from '../controllers/event.controller'

import { AuthGuard, checkRole } from '../middleware/auth.middleware'
import { ROLES } from '../helpers/constant'
import { validate } from '../middleware/validator.middleware'

const eventRoutes = Router()

eventRoutes.post(
  '/',
  AuthGuard,
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORGANIZER]),
  validate('createEvent'),
  EventController.create
)

export default eventRoutes
