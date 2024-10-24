import { Router } from 'express'
import authRoutes from './admin.routes'
import organizerRoutes from './organizer.routes'
import commonRoutes from './common.routes'
import { AuthGuard } from '../middleware/auth.middleware'

const route = Router()

route.use('/auth', authRoutes)
route.use('/organizer', organizerRoutes)
route.use('/generic', commonRoutes)

/**
 * Auth Routes
 */

export default route
