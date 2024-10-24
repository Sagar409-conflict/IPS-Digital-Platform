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
eventCategoryRoutes.get('/:id', EventCategoryController.get)

export default eventCategoryRoutes
