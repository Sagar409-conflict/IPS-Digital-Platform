import { Request, Response } from 'express'
import { EVENT_STATUS, LANGUAGE_CODE, MODULE_IDENTIFIRES, ROLES } from '../helpers/constant'
import { badRequest, internalServer, notFound, success, unAuthorized } from '../helpers/response'
import userService from '../services/user.service'
import RejectReasons from '../models/reject_reasons.model'
import eventService from '../services/event.service'
import { ICreateEvent } from '../types/event.interface'
import { statusCode } from '../config/statucCode'
import newsService from '../services/news.service'
import { ICreateNews } from '../types/news.interface'
import { generateQRCode } from '../helpers/fileUpload'

class CommonController {
  async statusUpdate(req: Request, res: Response) {
    const languageCode: string = (req.headers.languagecode as string) ?? LANGUAGE_CODE.IT

    try {
      const { module, id } = req.params
      const { status } = req.body

      switch (module) {
        case MODULE_IDENTIFIRES.USER:
          // Update user status
          if (req.user.role === ROLES.ORGANIZER) return unAuthorized(res, languageCode)
          const userUpdated = (await userService.update(id, { status }))[0]
          if (!userUpdated) return internalServer(res, languageCode, req.body, 'UNABLE_TO_UPDATE')
          const result = await userService.findOne({ where: { id }, raw: true })
          return success(res, languageCode, undefined, 'STATUS_UPDATED_SUCCESS', result)

        case MODULE_IDENTIFIRES.EVENT:
          // Update event status
          break
        default:
      }
    } catch (error) {
      console.error('🐛 ERROR 🐛', error)
      return internalServer(res, languageCode, req.body, undefined, (error as Error).message)
    }
  }

  async getRejectionReasonsList(req: Request, res: Response) {
    const languageCode: string = (req.headers.languagecode as string) ?? LANGUAGE_CODE.IT
    try {
      const type = String(req.query?.type) ?? ''
      if (![MODULE_IDENTIFIRES.EVENT, MODULE_IDENTIFIRES.NEWS].includes(type))
        return badRequest(res, languageCode, 'MODULE_IDENTIFIER_NOT_ALLOWED')

      const result = await RejectReasons.findAll({
        where: { type },
        attributes: ['id', 'reason'],
        raw: true,
      })

      if (result.length <= 0) return notFound(res, languageCode, 'UNABLE_TO_FETCH_REASONS_LIST')

      return success(res, languageCode, undefined, 'REJECTION_REASONS_LIST', result)
    } catch (error) {
      console.error('🐛 ERROR 🐛', error)
      return internalServer(res, languageCode, req.body, undefined, (error as Error).message)
    }
  }

  async modifyStatus(req: Request, res: Response) {
    const languageCode: string = (req.headers.languagecode as string) ?? LANGUAGE_CODE.IT
    try {
      const requestPayload = {
        id: String(req.body.id),
        type: String(req.body.type),
        status: String(req.body.status),
      }

      if (requestPayload.type === MODULE_IDENTIFIRES.EVENT) {
        const existingEvent = await eventService.findOne({
          where: { id: requestPayload.id },
          raw: true,
        })
        if (!existingEvent) {
          return badRequest(res, languageCode, 'EVENT_NOT_EXIST')
        }
        let payload: Partial<ICreateEvent> = {
          status: requestPayload.status,
        }
        if (requestPayload.status === EVENT_STATUS.PUBLISHED) {
          const path = await generateQRCode(requestPayload.id, existingEvent.title)
          payload = {
            ...payload,
            qr_code_image: path,
            publishedAt: new Date(),
          }
        } else {
          payload = {
            ...payload,
            reason_description: String(req.body.reason),
          }
        }
        const updateResult = await eventService.update(requestPayload.id, payload)
        if (!updateResult) {
          return internalServer(res, languageCode, req.body, 'UNABLE_TO_UPDATE_STATUS')
        }

        return success(res, languageCode, statusCode.SUCCESS, 'EVENT_STATUS_UPDATED_SUCCESSFULLY')
      } else if (requestPayload.type === MODULE_IDENTIFIRES.NEWS) {
        const existingNews = await newsService.getById(requestPayload.id)
        if (!existingNews) {
          return badRequest(res, languageCode, 'NEWS_NOT_FOUND')
        }
        let payload: Partial<ICreateNews> = {
          status: requestPayload.status,
        }
        if (requestPayload.status === EVENT_STATUS.PUBLISHED) {
          payload = {
            ...payload,
            publishedAt: new Date(),
          }
        } else {
          payload = {
            ...payload,
            reason_description: String(req.body.reason),
          }
        }
        const updateResult = await newsService.update(requestPayload.id, payload)
        if (!updateResult) {
          return internalServer(res, languageCode, req.body, 'UNABLE_TO_UPDATE_STATUS')
        }

        return success(res, languageCode, statusCode.SUCCESS, 'NEWS_STATUS_UPDATED_SUCCESSFULLY')
      }
    } catch (error) {
      console.error('🐛 ERROR 🐛', error)
      return internalServer(res, languageCode, req.body, undefined, (error as Error).message)
    }
  }
}
const commonController = new CommonController()
export default commonController
