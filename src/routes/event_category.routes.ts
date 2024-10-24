import { Router } from 'express'
import organizerController from '../controllers/organizer.controller'
import { validate } from '../middleware/validator.middleware'
import { AuthGuard, checkRole } from '../middleware/auth.middleware'
import { ROLES } from '../helpers/constant'

const eventCategoryRoutes = Router()

eventCategoryRoutes.post(
  '/',
  AuthGuard,
  checkRole([ROLES.SUPER_ADMIN]),
  validate('createOrganiser'),
  organizerController.createOrganizer
)

eventCategoryRoutes.get(
  '/',
  AuthGuard,
  checkRole([ROLES.SUPER_ADMIN]),
  organizerController.getAllOrganizer
)

eventCategoryRoutes.get(
  '/:id',
  AuthGuard,
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORGANIZER]),
  organizerController.get
)

eventCategoryRoutes.put(
  '/:id',
  AuthGuard,
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORGANIZER]),
  validate('updatedOrganiser'),
  organizerController.update
)

eventCategoryRoutes.delete(
  '/:id',
  AuthGuard,
  checkRole([ROLES.SUPER_ADMIN]),
  validate('id'),
  organizerController.delete
)
export default eventCategoryRoutes
