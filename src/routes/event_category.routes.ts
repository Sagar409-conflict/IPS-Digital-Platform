import { Router } from 'express'
import EventCategoryController from '../controllers/event_category.controller'
import { validate } from '../middleware/validator.middleware'
import { AuthGuard, checkRole } from '../middleware/auth.middleware'
import { ROLES } from '../helpers/constant'

const eventCategoryRoutes = Router()

eventCategoryRoutes.post(
  '/',
  AuthGuard,
  checkRole([ROLES.SUPER_ADMIN]),
  validate('createEventCategory'),
  EventCategoryController.create
)

eventCategoryRoutes.get('/', EventCategoryController.getAll)
eventCategoryRoutes.put(
  '/:id',
  AuthGuard,
  checkRole([ROLES.SUPER_ADMIN]),
  validate('updateEventCategory'),
  EventCategoryController.update
)
eventCategoryRoutes.get('/:id', EventCategoryController.get)
eventCategoryRoutes.delete(
  '/:id',
  AuthGuard,
  checkRole([ROLES.SUPER_ADMIN]),
  EventCategoryController.delete
)

export default eventCategoryRoutes
