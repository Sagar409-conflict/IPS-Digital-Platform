import { Router } from 'express'
import organizerController from '../controllers/organizer.controller'
import { validate } from '../middleware/validator.middleware'
import { AuthGuard, checkRole } from '../middleware/auth.middleware'
import { ROLES } from '../helpers/constant'

const organizerRoutes = Router()

organizerRoutes.post(
  '/',
  AuthGuard,
  checkRole([ROLES.SUPER_ADMIN]),
  validate('createOrganiser'),
  organizerController.createOrganizer
)

organizerRoutes.get(
  '/',
  AuthGuard,
  checkRole([ROLES.SUPER_ADMIN]),
  organizerController.getAllOrganizer
)

organizerRoutes.get(
  '/:id',
  AuthGuard,
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORGANIZER]),
  organizerController.get
)

organizerRoutes.put(
  '/:id',
  AuthGuard,
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORGANIZER]),
  validate('updatedOrganiser'),
  organizerController.update
)

organizerRoutes.delete(
  '/:id',
  AuthGuard,
  checkRole([ROLES.SUPER_ADMIN]),
  validate('id'),
  organizerController.delete
)
export default organizerRoutes
