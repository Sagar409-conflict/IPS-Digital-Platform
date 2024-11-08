import { Request, Response } from 'express'
import {
  EVENT_STATUS,
  LANGUAGE_CODE,
  MODULE_IDENTIFIRES,
  NEWS_STATUS,
  ROLES,
} from '../helpers/constant'
import { badRequest, internalServer, notFound, success, unAuthorized } from '../helpers/response'
import userService from '../services/user.service'
import RejectReasons from '../models/reject_reasons.model'
import eventService from '../services/event.service'
import { ICreateEvent, IEventPagination } from '../types/event.interface'
import { statusCode } from '../config/statucCode'
import newsService from '../services/news.service'
import { ICreateNews, INewsPagination } from '../types/news.interface'
import { generateQRCode } from '../helpers/fileUpload'
import { metaDataForPaginations } from '../helpers/common'
import mailTemplateService from '../services/mail_template.service'

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

        if (requestPayload.status === EVENT_STATUS.PUBLISHED) {
          const event = await eventService.findEeventDetails({ id: req.body.id })
          await mailTemplateService.sendPublishedEmail({
            title: event?.title,
            publishedAt:
              event && event.publishedAt !== undefined && event.publishedAt !== null
                ? event.publishedAt
                : new Date(),
            submittedAt:
              event && event.submittedAt !== undefined && event.submittedAt !== null
                ? event.submittedAt
                : new Date(),
            first_name: event && event.creator !== undefined ? event?.creator.first_name : '',

            last_name: event && event.creator !== undefined ? event.creator.last_name : '',

            email: event && event.creator !== undefined ? event?.creator.email : '',
            status: event?.status,
            type: req.body.type,
          })
        } else if (requestPayload.status === EVENT_STATUS.REJECTED) {
          const event = await eventService.findEeventDetails({ id: req.body.id })
          await mailTemplateService.sendRejectedEmail({
            title: event?.title,
            reason: event?.reason_description,
            publishedAt:
              event && event.publishedAt !== undefined && event.publishedAt !== null
                ? event.publishedAt
                : new Date(),
            submittedAt:
              event && event.submittedAt !== undefined && event.submittedAt !== null
                ? event.submittedAt
                : new Date(),
            first_name: event && event.creator !== undefined ? event?.creator.first_name : '',

            last_name: event && event.creator !== undefined ? event.creator.last_name : '',

            email: event && event.creator !== undefined ? event?.creator.email : '',
            status: event?.status,
            type: req.body.type,
          })
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
        if (requestPayload.status === NEWS_STATUS.PUBLISHED) {
          const news = await newsService.getById(req.body.id)
          await mailTemplateService.sendPublishedEmail({
            title: news?.title,
            publishedAt:
              news && news.publishedAt !== undefined && news.publishedAt !== null
                ? news.publishedAt
                : new Date(),
            submittedAt:
              news && news.submittedAt !== undefined && news.submittedAt !== null
                ? news.submittedAt
                : new Date(),
            first_name: news && news.creator !== undefined ? news?.creator.first_name : '',

            last_name: news && news.creator !== undefined ? news.creator.last_name : '',

            email: news && news.creator !== undefined ? news?.creator.email : '',
            status: news?.status,
            type: req.body.type,
          })
        } else if (requestPayload.status === NEWS_STATUS.REJECTED) {
          const news = await newsService.getById(req.body.id)
          await mailTemplateService.sendRejectedEmail({
            title: news?.title,
            reason: news?.reason_description,
            publishedAt:
              news && news.publishedAt !== undefined && news.publishedAt !== null
                ? news.publishedAt
                : new Date(),
            submittedAt:
              news && news.submittedAt !== undefined && news.submittedAt !== null
                ? news.submittedAt
                : new Date(),
            first_name: news && news.creator !== undefined ? news?.creator.first_name : '',

            last_name: news && news.creator !== undefined ? news.creator.last_name : '',

            email: news && news.creator !== undefined ? news?.creator.email : '',
            status: news?.status,
            type: req.body.type,
          })
        }

        return success(res, languageCode, statusCode.SUCCESS, 'NEWS_STATUS_UPDATED_SUCCESSFULLY')
      }
    } catch (error) {
      console.error('🐛 ERROR 🐛', error)
      return internalServer(res, languageCode, req.body, undefined, (error as Error).message)
    }
  }

  async mobileHomeScreen(req: Request, res: Response) {
    const languageCode: string = (req.headers.languagecode as string) ?? LANGUAGE_CODE.IT
    try {
      const {
        page,
        limit,
        search,
        status,
        // isTodayEvent,
        // isUpcomingEvent,
        // user_id,
        // event_category_id,
      } = req.query

      const responsePayload = {
        today_events: {},
        upcoming_events: {},
        news: {},
      }
      //Fetch Today's Eevent Data------------[STARTED]
      const pagination: IEventPagination = {
        page: 1,
        limit: 5,
        search: typeof search === 'undefined' ? undefined : String(search),
        status: EVENT_STATUS.PUBLISHED,
        isTodayEvent: true,
      }
      const { count: todayEventsCount, rows: todayEventsrows } = await eventService.findAll(
        pagination
      )
      const todayEventsDataPayload = {
        result: todayEventsrows,
      }
      responsePayload.today_events = todayEventsDataPayload
      //Fetch Today's Eevent Data------------[END]
      //*************************************************************************

      //Fetch Upcoming's Eevent Data------------[STARTED]
      delete pagination.isTodayEvent
      pagination.isUpcomingEvent = true
      const { count: upcomingEventsCount, rows: upcomingEventsrows } = await eventService.findAll(
        pagination
      )
      const upcomingEventsDataPayload = {
        result: upcomingEventsrows,
      }
      responsePayload.upcoming_events = upcomingEventsDataPayload
      //Fetch Upcoming's Eevent Data------------[END]
      //*************************************************************************
      // Fetch News Data------------[STARTED]
      const newsPagination: INewsPagination = {
        page: typeof page === 'undefined' ? 1 : Number(page),
        limit: typeof limit === 'undefined' ? 10 : Number(limit),
        search: typeof search === 'undefined' ? undefined : String(search),
        status: NEWS_STATUS.PUBLISHED,
      }
      const { count: newsCount, rows: newsRows } = await newsService.findAll(newsPagination)
      const newsDataPayload = {
        result: newsRows,
        pagination: await metaDataForPaginations(pagination?.page, pagination.limit, newsCount),
      }
      responsePayload.news = newsDataPayload
      // Fetch News Data------------[END]
      //*************************************************************************

      return success(res, languageCode, undefined, 'MOBILE_HOME_SCREEN_DATA', responsePayload)
    } catch (error) {
      console.error('🐛 ERROR 🐛', error)
      return internalServer(res, LANGUAGE_CODE.IT, req.body, undefined, (error as Error).message)
    }
  }
}
const commonController = new CommonController()
export default commonController
