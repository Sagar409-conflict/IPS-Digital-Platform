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

eventRoutes.get('/', EventController.getAll)

eventRoutes.get('/:id', validate('id'), EventController.get)

eventRoutes.delete(
  '/remove-event-assets/:id',
  AuthGuard,
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORGANIZER]),
  validate('id'),
  EventController.removeEventAssets
)

eventRoutes.delete(
  '/:id',
  validate('id'),
  AuthGuard,
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORGANIZER]),
  EventController.delete
)
eventRoutes.put('/:id', AuthGuard, validate('updateEvent'), EventController.update)
eventRoutes.put(
  '/status/:id',
  AuthGuard,
  checkRole([ROLES.SUPER_ADMIN]),
  validate('updateEventStatus'),
  EventController.statusUpdate
)

export default eventRoutes
