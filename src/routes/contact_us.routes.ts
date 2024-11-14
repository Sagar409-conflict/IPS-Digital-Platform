import { Router } from 'express'
import ContactUsController from '../controllers/contact_us.controller'

import { AuthGuard, checkRole } from '../middleware/auth.middleware'
import { ROLES } from '../helpers/constant'
import { validate } from '../middleware/validator.middleware'
import RateLimiter from '../middleware/rate-limiter.middleware'

const contactUsRoutes = Router()

contactUsRoutes.post('/', RateLimiter, validate('createContactUs'), ContactUsController.create)

contactUsRoutes.get('/', ContactUsController.getAll)
contactUsRoutes.get('/:id', ContactUsController.get)

export default contactUsRoutes
