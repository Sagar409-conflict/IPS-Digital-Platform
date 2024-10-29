import { Request, Response } from 'express'
import { badRequest, internalServer, success, unAuthorized } from '../helpers/response'
import { LANGUAGE_CODE, ROLES } from '../helpers/constant'

import { generateRandomString, metaDataForPaginations } from '../helpers/common'
import userService from '../services/user.service'
import { encrypt } from '../helpers/encrypt'
import { statusCode } from '../config/statucCode'
import { IPagination } from '../types/common.interface'
import mailTemplateService from '../services/mail_template.service'
import { removeFile, uploadFile } from '../helpers/fileUpload'
import { UploadedFile } from 'express-fileupload'
import eventCategoryService from '../services/event_category.service'
import { Op } from 'sequelize'
import { CONFIG } from '../config/config'

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

  /**********************************************************
   * REST API endpoint for get a list of all event categories
   * @param req
   * @param res
   * @returns
   **********************************************************/
  async getAll(req: Request, res: Response) {
    const languageCode: string = (req.headers.languagecode as string) ?? LANGUAGE_CODE.IT
    try {
      const { page_number, limit, search, status } = req.query

      //Paginations Setup
      const pagination: IPagination = {
        page_number: typeof page_number === 'undefined' ? 1 : Number(page_number),
        limit: typeof limit === 'undefined' ? 10 : Number(limit),
        search: typeof search === 'undefined' ? undefined : String(search),
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

  /****************************************************************
   * REST API endpoint for get details of specified event category
   * @param req
   * @param res
   * @returns
   ****************************************************************/
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

  /************************************************
   * REST API endpoint for update an event category
   * @param req
   * @param res
   * @returns
   ************************************************/
  async update(req: Request, res: Response) {
    const languageCode: string = (req.headers.languagecode as string) ?? LANGUAGE_CODE.IT
    console.log('dfsdfsdfs')

    try {
      let eventCategoryId = req.params.id
      let payload = req.body
      let icon_images_status: boolean = false

      // Check if user has necessary permissions or not
      if (req.user.role !== ROLES.SUPER_ADMIN) return unAuthorized(res, languageCode)

      // Check if whether the data is exist in the database or not
      const record = await eventCategoryService.findOne({
        where: { id: eventCategoryId },
        raw: true,
      })

      if (!record) return badRequest(res, languageCode, 'EVENT_CATEGORY_NOT_EXIST')

      // Upload the icon image if provided in req.files
      if (
        req.files != undefined &&
        req.files.icon_image !== undefined &&
        !Array.isArray(req.files.icon_image)
      ) {
        payload.icon_image = await uploadFile(req.files.icon_image, `event_category_icons/`)
        icon_images_status = true // modify the icon image flag and set it to true
      }
      // Perform Update operation to the database
      const userUpdated = (await eventCategoryService.update(eventCategoryId, payload))[0]

      // Check weather it was updated or not
      if (!userUpdated) return internalServer(res, languageCode, req.body, 'UNABLE_TO_UPDATE')

      // Fetch an updated record and send as a response
      const result = await userService.findOne({ where: { id: eventCategoryId }, raw: true })

      // If flag is set 'true' it means need to delete previous image form the storage
      if (icon_images_status) await removeFile(record?.icon_image)

      // Send the updated record as a response with success message
      return success(res, languageCode, undefined, 'EVENT_CATEGORY_UPDATED_SUCCESS', result)
    } catch (error) {
      console.error('🐛 ERROR 🐛', error)
      return internalServer(res, languageCode, req.body, undefined, (error as Error).message)
    }
  }

  /************************************************
   * REST API endpoint for delete an event category
   * @param req
   * @param res
   ***********************************************/
  async delete(req: Request, res: Response) {
    const languageCode: string = (req.headers.languagecode as string) ?? LANGUAGE_CODE.IT
    try {
      // Check if logged in user has necessary permissions or not
      if (req.user.role !== ROLES.SUPER_ADMIN) return unAuthorized(res, languageCode)

      // Check Request has necessary parameters or not
      if (!req.params.id)
        return internalServer(res, languageCode, req.body, 'INVALID_REQUEST_PARAMS')

      const { id } = req.params
      const record = await eventCategoryService.findOne({ where: { id }, raw: true })

      if (!record) return badRequest(res, languageCode, 'EVENT_CATEGORY_NOT_EXIST')
      const result = await eventCategoryService.delete(id)
      if (!result) return internalServer(res, languageCode, req.body, 'UNABLE_TO_DELETE')

      await removeFile(record?.icon_image)
      return success(res, languageCode, undefined, 'RECORD_SUCCESSFULLY_DELETED')
    } catch (error) {
      console.error('🐛 ERROR 🐛', error)
      return internalServer(res, languageCode, req.body, undefined, (error as Error).message)
    }
  }
}

const eventCategoryController = new EventCategoryController()
export default eventCategoryController
