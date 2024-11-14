import { Router } from 'express'
import newsController from '../controllers/news.controller'
import { validate } from '../middleware/validator.middleware'
import { AuthGuard } from '../middleware/auth.middleware'

const newsRoutes = Router()

newsRoutes.post('/', AuthGuard, validate('createNews'), newsController.create)
newsRoutes.get('/', newsController.getAll)
newsRoutes.get('/:id', newsController.getById)
newsRoutes.delete('/:id', AuthGuard, newsController.delete)
newsRoutes.put('/:id', AuthGuard, validate('updateNews'), newsController.update)

export default newsRoutes
