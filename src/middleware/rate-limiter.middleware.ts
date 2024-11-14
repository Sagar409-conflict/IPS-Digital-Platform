import rateLimit from 'express-rate-limit'
import { Request, Response } from 'express'
import { LANGUAGE_CODE } from '../helpers/constant'
import { tooManyRequests } from '../helpers/response'

/**
 *   Sets rate limiter window to 5 minutes, restricting requests within this timeframe to prevent abuse.
 */
const RateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 3,
  handler: (req: Request, res: Response) => {
    const languageCode: string = (req.headers.languagecode as string) ?? LANGUAGE_CODE.IT
    return tooManyRequests(res, languageCode)
  },
})

export default RateLimiter
