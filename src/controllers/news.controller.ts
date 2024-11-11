import { Request, Response, Router } from 'express'
import { badRequest, internalServer, success, unAuthorized } from '../helpers/response'
import { LANGUAGE_CODE, NEWS_STATUS, ROLES } from '../helpers/constant'
import newsService from '../services/news.service'
import { statusCode } from '../config/statucCode'
import { IPagination } from '../types/common.interface'
import { removeFile, uploadFile } from '../helpers/fileUpload'
import { metaDataForPaginations } from '../helpers/common'
import path from 'path'
import { INewsPagination } from '../types/news.interface'
import mailTemplateService from '../services/mail_template.service'
import User from '../models/user.model'
import e from 'cors'
import News from '../models/news.models'

class NewsCategoryController {
  /**************************************************************************
   * REST API endpoint for creating a new news item
   * @param req
   * @param res
   * @returns
   **************************************************************************/
  // async create(req: Request, res: Response) {
  //   const languageCode: string = (req.headers.languagecode as string) ?? LANGUAGE_CODE.IT
  //   try {
  //     let payload = req.body
  //     const validStatuses = ['draft', 'pending', 'approved']
  //     if (payload.status && !validStatuses.includes(payload.status)) {
  //       return badRequest(res, languageCode, 'INVALID_STATUS')
  //     }

  //     if (!req.files || !req.files.news_image || Array.isArray(req.files.news_image)) {
  //       return badRequest(res, languageCode, 'IMAGE_REQUIRED')
  //     }

  //     payload.news_image = await uploadFile(req.files.news_image, `news_images/`)

  //     await newsService.create(payload)

  //     return success(res, languageCode, statusCode.SUCCESS, 'NEWS_CREATED_SUCCESSFULLY')
  //   } catch (error) {
  //     console.error('🐛 ERROR 🐛', error)
  //     return internalServer(res, languageCode, req.body, undefined, (error as Error).message)
  //   }
  // }
  async create(req: Request, res: Response) {
    const languageCode: string = (req.headers.languagecode as string) ?? LANGUAGE_CODE.IT

    try {
      let payload = req.body
      payload.creator_id = req.user.id
      const statusValidation = {
        [ROLES.ORGANIZER]: ['draft', 'pending'],
        [ROLES.SUPER_ADMIN]: ['draft', 'published'],
      }

      const userRole = req.user.role

      if (statusValidation[userRole] && !statusValidation[userRole].includes(payload.status)) {
        return badRequest(res, languageCode, `INVALID_STATUS_FOR_USER_ROLE`)
      }

      if (!req.files || !req.files.news_image || Array.isArray(req.files.news_image)) {
        return badRequest(res, languageCode, 'IMAGE_REQUIRED')
      }

      payload.news_image = await uploadFile(req.files.news_image, `news_images/`)
      if (payload.status === NEWS_STATUS.PUBLISHED && req.user.role === ROLES.SUPER_ADMIN) {
        payload.publishedAt = new Date()
      } else if (payload.status === NEWS_STATUS.PUBLISHED && req.user.role === ROLES.ORGANIZER) {
        return badRequest(res, languageCode, 'NOT_ALLOWED_TO_PUBLISH')
      } else if (payload.status === NEWS_STATUS.PENDING && req.user.role === ROLES.ORGANIZER) {
        payload.submittedAt = new Date()
      }

      await newsService.create(payload)

      if (payload.status === 'pending') {
        const superAdmin = await User.findOne({ where: { role: 'super_admin' } })
        if (!superAdmin?.email) {
          console.error('Super admin email is undefined.')
          return badRequest(res, languageCode, 'SUPER_ADMIN_EMAIL_REQUIRED')
        }
        const mailBody = {
          email: superAdmin?.email,
          admin_first_name: superAdmin?.first_name,
          admin_last_name: superAdmin?.last_name,
          first_name: req.user.first_name,
          last_name: req.user.last_name,
          title: req.body.title,
          organizer_email: req.user.email,
          // submited: data.news._previousDataValues.submittedAt
        }
        await mailTemplateService.sendPendingApprovalEmail(mailBody)
      }

      return success(res, languageCode, statusCode.SUCCESS, 'NEWS_CREATED_SUCCESSFULLY')
    } catch (error) {
      console.error('🐛 ERROR 🐛', error)
      return internalServer(res, languageCode, req.body, undefined, (error as Error).message)
    }
  }

  /****************************************************
   * REST API endpoint for get a list of all Organizers
   * @param req
   * @param res
   * @returns
   ****************************************************/

  async getAll(req: Request, res: Response) {
    const languageCode: string = (req.headers.languagecode as string) ?? LANGUAGE_CODE.IT
    try {
      const { page, limit, search, status, user_id, news_category_ids } = req.query

      const pagination: INewsPagination = {
        page: typeof page === 'undefined' ? 1 : Number(page),
        limit: typeof limit === 'undefined' ? 10 : Number(limit),
        search: typeof search === 'undefined' ? undefined : String(search),
        status: typeof status === 'undefined' ? undefined : String(status),
        user_id: typeof user_id === 'undefined' ? undefined : String(user_id),
        news_category_ids:
          typeof news_category_ids === 'undefined'
            ? undefined
            : String(news_category_ids).split(','),

        role: ROLES.ORGANIZER,
      }
      const { count, rows } = await newsService.findAll(pagination)
      const data = {
        result: rows,
        pagination: await metaDataForPaginations(pagination?.page, pagination.limit, count),
      }
      return success(res, languageCode, statusCode.SUCCESS, 'NEWS_LIST', data)
    } catch (error) {
      console.error('🐛 ERROR 🐛', error)
      return internalServer(res, languageCode, req.body, undefined, (error as Error).message)
    }
  }

  /**************************************************************************
   * REST API endpoint for create a news category
   * @param req
   * @param res
   * @returns
   **************************************************************************/

  async getById(req: Request, res: Response) {
    const languageCode: string = (req.headers.languagecode as string) ?? LANGUAGE_CODE.IT
    try {
      const { id } = req.params
      const newsCategory = await newsService.getById(id)

      if (!newsCategory) {
        return badRequest(res, languageCode, 'NEWS_NOT_FOUND')
      }

      return success(res, languageCode, statusCode.SUCCESS, 'NEWS_LIST', newsCategory)
    } catch (error) {
      console.error('��� ERROR ��', error)
      return internalServer(res, languageCode, req.body, undefined, (error as Error).message)
    }
  }

  /************************************************
   * REST API endpoint for delete an requested news
   * @param req
   * @param res
   ***********************************************/
  async delete(req: Request, res: Response) {
    const languageCode: string = (req.headers.languagecode as string) ?? LANGUAGE_CODE.IT
    try {
      const { id } = req.params
      const news = await newsService.getById(id)

      if (!news) {
        return badRequest(res, languageCode, 'NEWS_NOT_FOUND')
      }

      if (news.news_image) {
        const imagepath = path.join(__dirname, `../public${news.news_image}`)

        const removeIconResult = await removeFile(news.news_image)

        if (removeIconResult.error) {
          return badRequest(res, languageCode, 'Error deleting associated news image')
        }
      }
      await newsService.delete(id)

      return success(res, languageCode, statusCode.SUCCESS, 'NEWS_DELETED_SUCCESSFULLY')
    } catch (error) {
      console.error('��� ERROR ��', error)
      return internalServer(res, languageCode, req.body, undefined, (error as Error).message)
    }
  }

  /************************************************
   * REST API endpoint for update an news category
   * @param req
   * @param res
   * @returns
   ************************************************/
  async update(req: Request, res: Response) {
    const languageCode: string = (req.headers.languagecode as string) ?? LANGUAGE_CODE.IT

    try {
      const { id } = req.params
      const payload = req.body

      const statusValidation = {
        [ROLES.ORGANIZER]: ['draft', 'pending'],
        [ROLES.SUPER_ADMIN]: ['draft', 'published'],
      }

      const userRole = req.user.role

      const existingNews = await newsService.getById(id)
      if (!existingNews) {
        return badRequest(res, languageCode, 'NEWS_NOT_FOUND')
      }

      if (payload.status) {
        if (!statusValidation[userRole]?.includes(payload.status)) {
          return badRequest(res, languageCode, `INVALID_STATUS_FOR_USER_ROLE`)
        }
      }
      if (payload.status === NEWS_STATUS.PUBLISHED) {
        payload.publishedAt = new Date()
      }
      if (payload.status === NEWS_STATUS.PENDING) {
        payload.submittedAt = new Date()
      }

      if (req.files && req.files.news_image && !Array.isArray(req.files.news_image)) {
        if (existingNews.news_image) {
          await removeFile(existingNews.news_image)
        }
        payload.news_image = await uploadFile(req.files.news_image, `news_images/`)
      }

      const updateResult = await newsService.update(id, payload)
      if (!updateResult) {
        return internalServer(res, languageCode, req.body, 'UNABLE_TO_UPDATE')
      }

      const updatedNews = await newsService.getById(id)

      return success(
        res,
        languageCode,
        statusCode.SUCCESS,
        'NEWS_UPDATED_SUCCESSFULLY',
        updatedNews
      )
    } catch (error) {
      console.error('🐛 ERROR 🐛', error)
      return internalServer(res, languageCode, req.body, undefined, (error as Error).message)
    }
  }

  /************************************************
   * REST API endpoint for update an event category
   * @param req
   * @param res
   * @returns
   ************************************************/
  async statusUpdate(req: Request, res: Response) {
    const languageCode: string = (req.headers.languagecode as string) ?? LANGUAGE_CODE.IT
    const validStatuses = [NEWS_STATUS.PUBLISHED, NEWS_STATUS.REJECTED]

    try {
      const { id } = req.params
      const { status } = req.body

      if (!status || !validStatuses.includes(status)) {
        return badRequest(res, languageCode, 'INVALID_STATUS')
      }

      const existingNews = await newsService.getById(id)
      if (!existingNews) {
        return badRequest(res, languageCode, 'NEWS_NOT_FOUND')
      }

      const updateResult = await newsService.update(id, { status })
      if (!updateResult) {
        return internalServer(res, languageCode, req.body, 'UNABLE_TO_UPDATE_STATUS')
      }

      const news = await newsService.getById(id)
      const newsDAta = news

      if (status === NEWS_STATUS.PUBLISHED) {
        const mailBody = {
          submittedAt:
            news && news.submittedAt !== undefined && news.submittedAt !== null
              ? news.submittedAt
              : new Date(),
          publishedAt:
            news && news.publishedAt !== undefined && news.publishedAt !== null
              ? news.publishedAt
              : new Date(),
          first_name:
            newsDAta && newsDAta.creator !== undefined ? newsDAta?.creator.first_name : '',
          last_name: newsDAta && newsDAta.creator !== undefined ? newsDAta.creator.last_name : '',
          email: newsDAta && newsDAta.creator !== undefined ? newsDAta?.creator.email : '',
          newsTitle: news?.title,
          status: news?.status,
        }

        await mailTemplateService.sendPublishedEmail(mailBody)
      } else if (status === NEWS_STATUS.REJECTED) {
        const mailBody = {
          submittedAt:
            news && news.submittedAt !== undefined && news.submittedAt !== null
              ? news.submittedAt
              : new Date(),
          publishedAt:
            news && news.publishedAt !== undefined && news.publishedAt !== null
              ? news.publishedAt
              : new Date(),
          first_name: newsDAta && newsDAta.creator !== undefined ? newsDAta.creator.first_name : '',
          last_name: newsDAta && newsDAta.creator !== undefined ? newsDAta.creator.last_name : '',
          email: newsDAta && newsDAta.creator !== undefined ? newsDAta?.creator.email : '',
          newsTitle: news?.title,
          status: news?.status,
          // rejectionReason: rejectionReason || 'No specific reason provided.',
        }
        await mailTemplateService.sendRejectedEmail(mailBody)
      }

      return success(res, languageCode, statusCode.SUCCESS, 'NEWS_STATUS_UPDATED_SUCCESSFULLY')
    } catch (error) {
      console.error('🐛 ERROR 🐛', error)
      return internalServer(res, languageCode, req.body, undefined, (error as Error).message)
    }
  }
}

const newscategorycontroller = new NewsCategoryController()
export default newscategorycontroller
