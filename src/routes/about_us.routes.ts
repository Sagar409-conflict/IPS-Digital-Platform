import { Router } from 'express'
import aboutUsController from '../controllers/about_us.controller'

import { AuthGuard, checkRole } from '../middleware/auth.middleware'
import { ROLES } from '../helpers/constant'
import { validate } from '../middleware/validator.middleware'

const aboutUsRoutes = Router()

/**
 * Update section data of about us page
 *
 * Protected route requiring authentication and Super Admin privileges.
 * Validates request data against 'updateAboutUs' schema.
 *
 * @route PUT /about-us/:id
 */
aboutUsRoutes.put(
  '/:id',
  AuthGuard,
  checkRole([ROLES.SUPER_ADMIN]),
  validate('updateAboutUs'),
  aboutUsController.update
)

/**
 * Get all section data of about us page
 *
 * Public route
 *
 * @route GET /about-us
 */
aboutUsRoutes.get('/', aboutUsController.getAll)

/**
 * Get specific section data of about us page
 *
 * Public route
 *
 * @route GET /about-us/:id
 */
aboutUsRoutes.get('/:id', aboutUsController.get)

/**
 * Delete specific section data of about us page
 *
 * Protected route requiring authentication and Super Admin privileges.
 * Validates request data against 'id' schema.
 *
 * @route DELETE /about-us/:id
 */
aboutUsRoutes.delete(
  '/remove-banner-image/:id',
  AuthGuard,
  checkRole([ROLES.SUPER_ADMIN]),
  validate('id'),
  aboutUsController.delete
)

export default aboutUsRoutes
