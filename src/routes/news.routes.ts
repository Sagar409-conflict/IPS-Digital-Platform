import { Router } from 'express'
import newsController from '../controllers/news.controller'
import { validate } from '../middleware/validator.middleware'
import { AuthGuard, checkRole } from '../middleware/auth.middleware'
import { ROLES } from '../helpers/constant'

const newsRoutes = Router()

newsRoutes.post('/', AuthGuard, validate('createNews'), newsController.create)
newsRoutes.get('/', newsController.getAll)
newsRoutes.get('/:id', newsController.getById)
newsRoutes.delete('/:id', AuthGuard, newsController.delete)
newsRoutes.put('/:id', AuthGuard, validate('updateNews'), newsController.update)
newsRoutes.put(
  '/status/:id',
  AuthGuard,
  checkRole([ROLES.SUPER_ADMIN]),
  validate('updateNewsStatus'),
  newsController.statusUpdate
)

export default newsRoutes
