import { Request, Response } from 'express'
import { badRequest, internalServer, success, unAuthorized } from '../helpers/response'
import { LANGUAGE_CODE, ROLES } from '../helpers/constant'

import { generateRandomString, metaDataForPaginations } from '../helpers/common'
import userService from '../services/user.service'
import { encrypt } from '../helpers/encrypt'
import { statusCode } from '../config/statucCode'
import { IPagination } from '../types/common.interface'
import mailTemplateService from '../services/mail_template.service'
import { uploadFile } from '../helpers/fileUpload'
import { UploadedFile } from 'express-fileupload'
import eventCategoryService from '../services/event_category.service'
import { Op } from 'sequelize'

class EventCategoryController {
  /**************************************************************************
   * REST API endpoint for create a new event category
   * @param req
   * @param res
   * @returns
   **************************************************************************/
  async create(req: Request, res: Response) {
    const languageCode: string = (req.headers.languagecode as string) ?? LANGUAGE_CODE.IT
    try {
      let payload = req.body

      // Check Category si already exists or not
      const isExist = await eventCategoryService.findOne({
        where: {
          title: {
            [Op.like]: `%${payload.title}%`,
          },
        },
        raw: true,
      })
      if (isExist) {
        return badRequest(res, languageCode, 'EVENT_CATEGORY_EXIST')
      }

      // Upload the icon image if provided or not
      if (
        req.files != undefined &&
        req.files.icon_image !== undefined &&
        !Array.isArray(req.files.icon_image)
      ) {
        payload.icon_image = await uploadFile(req.files.icon_image, `event_category_icons/`)
      } else {
        return badRequest(res, languageCode, req.body, 'MEDIA_EVENT_ICON_REQUIRED')
      }

      // Create the event category in the database
      await eventCategoryService.create(payload)
      return success(res, languageCode, statusCode.SUCCESS, 'EVENT_CATEGORY_CREATED')
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
      const { page_number, limit, search, status } = req.query

      //Paginations Setup
      const pagination: IPagination = {
        page_number: typeof page_number === 'undefined' ? 1 : Number(page_number),
        limit: typeof limit === 'undefined' ? 10 : Number(limit),
        search: typeof search === 'undefined' ? undefined : String(search),
        status: typeof status === 'undefined' ? undefined : Number(status),
        role: ROLES.ORGANIZER,
      }

      //Get all customizations based on search and pagination
      const { count, rows } = await eventCategoryService.findAll(pagination)
      const data = {
        result: rows,
        pagination: await metaDataForPaginations(pagination?.page_number, pagination.limit, count),
      }
      return success(res, languageCode, statusCode.SUCCESS, 'EVENT_CATEGORY_LIST', data)
    } catch (error) {
      console.error('🐛 ERROR 🐛', error)
      return internalServer(res, languageCode, req.body, undefined, (error as Error).message)
    }
  }

  /**********************************************************
   * REST API endpoint for get details of specified organiser
   * @param req
   * @param res
   * @returns
   **********************************************************/
  async get(req: Request, res: Response) {
    const languageCode: string = (req.headers.languagecode as string) ?? LANGUAGE_CODE.IT
    try {
      const { id } = req.params
      const getEventCategory = await eventCategoryService.findOne({
        where: {
          id,
        },
        raw: true,
      })
      if (!getEventCategory) return badRequest(res, languageCode, 'EVENT_CATEGORY_NOT_EXIST')

      return success(res, languageCode, undefined, 'DETAILS_OF_EVENT_CATEGORY', getEventCategory)
    } catch (error) {
      console.error('🐛 ERROR 🐛', error)
      return internalServer(res, languageCode, req.body, undefined, (error as Error).message)
    }
  }

  /****************************************************************
   * REST API endpoint for update an information for requested user
   * @param req
   * @param res
   * @returns
   ***************************************************************/
  async update(req: Request, res: Response) {
    const languageCode: string = (req.headers.languagecode as string) ?? LANGUAGE_CODE.IT

    try {
    } catch (error) {
      console.error('🐛 ERROR 🐛', error)
      return internalServer(res, languageCode, req.body, undefined, (error as Error).message)
    }
  }

  /************************************************
   * REST API endpoint for delete an requested user
   * @param req
   * @param res
   ***********************************************/
  async delete(req: Request, res: Response) {
    const languageCode: string = (req.headers.languagecode as string) ?? LANGUAGE_CODE.IT
    try {
    } catch (error) {
      console.error('🐛 ERROR 🐛', error)
      return internalServer(res, languageCode, req.body, undefined, (error as Error).message)
    }
  }
}

const eventCategoryController = new EventCategoryController()
export default eventCategoryController
