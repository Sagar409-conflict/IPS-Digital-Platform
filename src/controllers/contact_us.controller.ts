import { Request, Response } from 'express'
import { LANGUAGE_CODE } from '../helpers/constant'
import {
  badRequest,
  customeResponse,
  internalServer,
  notFound,
  success,
  unAuthorized,
  validationErrorResponse,
} from '../helpers/response'
import { statusCode } from '../config/statucCode'
import contactUsService from '../services/contact_us.service'
import { IContactUsPagination } from '../types/contact_us.interface'
import { metaDataForPaginations } from '../helpers/common'

class ContactUsController {
  /**
   * REST API endpoint for create contact inquiry
   * @param req
   * @param res
   * @returns
   */
  async create(req: Request, res: Response) {
    const languageCode: string = (req.headers.languagecode as string) ?? LANGUAGE_CODE.IT

    try {
      console.log(req.body)
      await contactUsService.create(req.body)

      return success(res, languageCode, undefined, 'CONTACT_CREATE_SUCCESS')
    } catch (error) {
      console.error('🐛 ERROR 🐛', error)
      return internalServer(res, languageCode, req.body, undefined, (error as Error).message)
    }
  }

  /**
   * REST API endpoint for Get All Sections of About Us
   * @param req
   * @param res
   * @returns
   */
  async getAll(req: Request, res: Response) {
    const languageCode: string = (req.headers.languagecode as string) ?? LANGUAGE_CODE.IT

    try {
      const { page, limit, search } = req.query
      const pagination: IContactUsPagination = {
        page: typeof page === 'undefined' ? 1 : Number(page),
        limit: typeof limit === 'undefined' ? 10 : Number(limit),
        search: typeof search === 'undefined' ? undefined : String(search),
      }

      const { count, rows } = await contactUsService.findAll(pagination)
      const data = {
        result: rows,
        pagination: await metaDataForPaginations(pagination?.page, pagination.limit, count),
      }
      return success(res, languageCode, statusCode.SUCCESS, 'CONTACT_INQUIRY_LIST', data)
    } catch (error) {
      console.error('🐛 ERROR 🐛', error)
      return internalServer(res, languageCode, req.body, undefined, (error as Error).message)
    }
  }

  async get(req: Request, res: Response) {
    const languageCode: string = (req.headers.languagecode as string) ?? LANGUAGE_CODE.IT

    try {
      const { id } = req.params
      const data = await contactUsService.findById(String(id))
      if (!data) {
        return badRequest(res, languageCode, 'UNABLE_TO_FOUND_A_RECORD')
      }
      return success(res, languageCode, statusCode.SUCCESS, 'CONTACT_INQUIRY_FOUND', data)
    } catch (error) {
      console.error('🐛 ERROR 🐛', error)
      return internalServer(res, languageCode, req.body, undefined, (error as Error).message)
    }
  }
}
const contactUsController = new ContactUsController()
export default contactUsController
