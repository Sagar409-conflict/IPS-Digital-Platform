import { Router } from 'express'
import newscategoryController from '../controllers/news_category.controller'
import { validate } from '../middleware/validator.middleware'
import { AuthGuard, checkRole } from '../middleware/auth.middleware'
import { ROLES } from '../helpers/constant'

const newsCategoryRoutes = Router()

newsCategoryRoutes.post(
  '/',
  // AuthGuard,
  // checkRole([ROLES.SUPER_ADMIN]),
  // validate('createNewsCategory'),
  newscategoryController.create
)

newsCategoryRoutes.get(
  '/',
  newscategoryController.getAll
)

newsCategoryRoutes.get(
  '/:id',
  newscategoryController.getById
)

newsCategoryRoutes.delete(
  '/:id',
  newscategoryController.delete
)
export default newsCategoryRoutes
