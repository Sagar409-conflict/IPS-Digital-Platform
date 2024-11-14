import express, { Application } from 'express'
import { CONFIG } from './config/config'
import connectDB from './models'
import { setupMiddlewareAndRoutes } from './middleware/setupMiddleware'

const app: Application = express()

setupMiddlewareAndRoutes(app)

const PORT = CONFIG.PORT

connectDB().then(() => {
  bootstrap()
})

const bootstrap = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch (error) {
    console.error('app bootstrap error: ', error)
    process.exit(1)
  }
}
