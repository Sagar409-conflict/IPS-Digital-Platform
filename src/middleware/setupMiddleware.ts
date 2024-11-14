// middleware.ts
import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import path from 'path'
import fileUpload from 'express-fileupload'
import { logUrl } from './url-logger.middleware'
import route from '../routes'

export const setupMiddlewareAndRoutes = (app: Application) => {
  // CORS setup
  app.use(
    cors({
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'languageCode',
      ],
      credentials: true,
    })
  )

  // File upload and static file serving
  app.use(fileUpload({ parseNested: true }))
  app.use(express.static(path.join(__dirname, '../public')))

  // Parsing requests
  app.use(express.urlencoded({ limit: '500mb', extended: false }))
  app.use(express.json({ limit: '500mb' }))

  // Custom middlewares
  app.use(logUrl)

  // Route initialization
  app.use('/api', route)

  // Health check route
  app.get('/ping', (req: Request, res: Response) => {
    res.status(200).json({ message: 'Server is working properly!' })
  })
}
