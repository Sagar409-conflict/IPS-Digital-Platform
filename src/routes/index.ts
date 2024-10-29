import { Router } from 'express'
import authRoutes from './admin.routes'
import organizerRoutes from './organizer.routes'
import eventCategoryRoutes from './event_category.routes'
import eventRoutes from './event.routes'
import commonRoutes from './common.routes'
import { AuthGuard } from '../middleware/auth.middleware'
import newsCategoryRoutes from './news_category.routes'
import newsRoutes from './news.routes'

const route = Router()

route.use('/auth', authRoutes)
route.use('/organizer', organizerRoutes)
route.use('/event-category', eventCategoryRoutes)
route.use('/event', eventRoutes)
route.use('/generic', commonRoutes)
route.use('/news-category', newsCategoryRoutes)
route.use('/news', newsRoutes)

/**
 * Auth Routes
 */

export default route
