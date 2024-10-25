import { Router } from 'express'
import authRoutes from './admin.routes'
import organizerRoutes from './organizer.routes'
import eventCategoryRoutes from './event_category.routes'
import commonRoutes from './common.routes'
import { AuthGuard } from '../middleware/auth.middleware'
import newsCategoryRoutes from './news_category.routes'

const route = Router()

route.use('/auth', authRoutes)
route.use('/organizer', organizerRoutes)
route.use('/event-category', eventCategoryRoutes)
route.use('/generic', commonRoutes)
route.use('/news-category', newsCategoryRoutes)

/**
 * Auth Routes
 */

export default route
