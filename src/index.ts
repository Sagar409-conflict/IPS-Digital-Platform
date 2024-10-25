import express, { Application, Request, Response } from 'express'
import cors from 'cors'

import fs from 'fs'
import path from 'path'
import bodyParser from 'body-parser'
import { CONFIG } from './config/config'
import route from './routes'
import connectDB from './models'
import { Server } from 'http'
import fileUpload from 'express-fileupload'

const app: Application = express()

app.disable('x-powered-by')

// Custom type for Stripe Webhook Requests
interface StripeRequest extends Request {
  rawBody: Buffer
}
app.use(
  bodyParser.json({
    verify: (req: Request, res, buf) => {
      ;(req as StripeRequest).rawBody = buf // Type assertion here
    },
  })
)

//for CORS
app.use(
  cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    credentials: true,
  })
)
// Enable file upload support
app.use(express.static(path.join(__dirname, 'public')))
app.use(fileUpload())

app.use(bodyParser.urlencoded({ limit: '500mb', extended: false }))

// parse application/json
app.use(bodyParser.json({ limit: '500mb' }))
app.use(express.json({ limit: '500mb' }))

//Routes initialization
app.use('/api', route)

app.get('/ping', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Server is working properly!' })
  return
})

const PORT = CONFIG.PORT

// Create HTTP server and integrate with Socket.io
const httpServer = new Server(app)

connectDB().then(() => {
  bootstrap()
})

const bootstrap = async () => {
  try {
    httpServer.listen(PORT, () => {
      // console.log('>>>>', __dirname)
      console.log(`Server is running on port ${PORT}`)
    })
  } catch (error) {
    console.error('app bootstrap error: ', error)
    process.exit(1)
  }
}
