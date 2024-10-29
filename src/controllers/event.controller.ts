import { Request, Response } from 'express'
import {
  EVENT_MEDIA_TYPE,
  EVENT_STATUS,
  LANGUAGE_CODE,
  MODULE_IDENTIFIRES,
  ROLES,
} from '../helpers/constant'
import { badRequest, internalServer, success, unAuthorized } from '../helpers/response'
import userService from '../services/user.service'
import { removeFile, removeFolder, uploadAssetsHelper, uploadFile } from '../helpers/fileUpload'
import eventService from '../services/event.service'
import { ICreateEventAssets } from '../types/event_assets.interface'
import { UploadedFile } from 'express-fileupload'
import { IPagination } from '../types/common.interface'
import { metaDataForPaginations } from '../helpers/common'
import { statusCode } from '../config/statucCode'

class EventController {
  /***************************************
   * REST API endpoint for create an event
   * @param req
   * @param res
   * @returns
   **************************************/
  async create(req: Request, res: Response) {
    const languageCode: string = (req.headers.languagecode as string) ?? LANGUAGE_CODE.IT

    try {
      const payload = req.body
      payload.location_coordinates = JSON.parse(req.body.location_coordinates)

      // Set default values in payload
      payload.creator_id = req.user.id

      if (payload.status === EVENT_STATUS.PUBLISHED && req.user.role === ROLES.SUPER_ADMIN) {
        payload.status = EVENT_STATUS.PUBLISHED
      } else if (payload.status === EVENT_STATUS.PUBLISHED && req.user.role === ROLES.ORGANIZER) {
        return badRequest(res, languageCode, 'NOT_ALLOWED_TO_PUBLISH')
      }

      // All Required Validations for validating files
      if (req.files) {
        if (!req.files.thumbnail_image) {
          return badRequest(res, languageCode, 'EVENT_THUMBNAIL_IMAGE_REQUIRED')
        } else if (!req.files.event_videos) {
          return badRequest(res, languageCode, 'EVENT_VIDEO_REQUIRED')
        } else if (!req.files.event_images) {
          return badRequest(res, languageCode, 'EVENT_IMAGE_REQUIRED')
        }
      } else {
        return badRequest(res, languageCode, 'EVENT_THUMBNAIL_IMAGE_REQUIRED')
      }
      /**
       * At this point here we have all media files in request
       */
      // Upload a thumbnail image
      if (!Array.isArray(req.files.thumbnail_image)) {
        payload.thumbnail_image = await uploadFile(
          req.files.thumbnail_image,
          `event_assets/${payload.title}/thumbnail_image/`
        )
      }

      // Create an event using basic details
      console.log('payload : ', payload)

      const recordCreated = await eventService.create(payload)

      if (!recordCreated) {
        console.log('Error In Creation of Event')
      }

      // Upload event videos in EventAssets Table
      const bulkCreationStatusVideo = await uploadAssetsHelper(
        req.files.event_videos,
        recordCreated.id,
        EVENT_MEDIA_TYPE.VIDEO,
        `event_assets/${payload.title}/event_videos/`
      )

      if (!bulkCreationStatusVideo.length) {
        console.log('Something went wrong in video upload function')
      }

      // Upload event image in EventAssets Table
      const bulkCreationStatusImage = await uploadAssetsHelper(
        req.files.event_images,
        recordCreated.id,
        EVENT_MEDIA_TYPE.IMAGE,
        `event_assets/${payload.title}/event_images/`
      )

      if (!bulkCreationStatusImage.length) {
        console.log('Something went wrong in image upload function')
      }

      return success(res, languageCode, undefined, 'EVENT_CREATION_SUCCESS')
    } catch (error) {
      console.error('🐛 ERROR 🐛', error)
      return internalServer(res, languageCode, req.body, undefined, (error as Error).message)
    }
  }

  /***********************************************************
   * REST API endpoint for get all events through a pagination
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
        status: typeof status === 'undefined' ? undefined : String(status),
      }

      //Get all customizations based on search and pagination
      const { count, rows } = await eventService.findAll(pagination)
      const data = {
        result: rows,
        pagination: await metaDataForPaginations(pagination?.page_number, pagination.limit, count),
      }
      return success(res, languageCode, statusCode.SUCCESS, 'EVENT_LIST', data)
    } catch (error) {
      console.error('🐛 ERROR 🐛', error)
      return internalServer(res, languageCode, req.body, undefined, (error as Error).message)
    }
  }

  /**************************************************
   * REST API endpoint for Get specific event details
   * @param req
   * @param res
   *************************************************/
  async get(req: Request, res: Response) {
    const languageCode: string = (req.headers.languagecode as string) ?? LANGUAGE_CODE.IT
    try {
      const event_id = req.params.id
      const getEvent = await eventService.findEeventDetails({ id: event_id })

      if (!getEvent) return badRequest(res, languageCode, 'EVENT_NOT_EXIST')

      return success(res, languageCode, undefined, 'DETAILS_OF_EVENT', getEvent)
    } catch (error) {
      console.error('🐛 ERROR 🐛', error)
      return internalServer(res, languageCode, req.body, undefined, (error as Error).message)
    }
  }

  async delete(req: Request, res: Response) {
    const languageCode: string = (req.headers.languagecode as string) ?? LANGUAGE_CODE.IT
    try {
      const event_id = req.params.id
      let where: {} = { id: event_id }
      if (req.user.role === ROLES.ORGANIZER) {
        where = {
          ...where,
          creator_id: req.user.id,
        }
      }

      // Check if event exists before deletion
      const isExist = await eventService.findEeventDetails(where)
      if (!isExist) return badRequest(res, languageCode, 'EVENT_NOT_EXIST')

      // If Organizer wants to delete the event
      if (req.user.role === ROLES.ORGANIZER && isExist.status === EVENT_STATUS.PUBLISHED)
        return badRequest(res, languageCode, 'NOT_ALLOWED_TO_DELETE')

      const deletedStatus = await eventService.delete(event_id)

      // Check if the event deleted successfully or not?
      if (!deletedStatus) return internalServer(res, languageCode, undefined, 'UNABLE_TO_DELETE')

      //If deletion is successful then remove media files also
      // Remove Entire folder of an event
      await removeFolder(`event_assets/${isExist.title}`)

      /*------START--------If remove one by one file ----------------
      // Delete event and its related assets
       if (isExist.event_assets && isExist.event_assets.length > 0) {
         isExist.event_assets.map(async (media) => {
           await removeFile(media.path)
         })
       }

      //Remove Thumbnail Image
       await removeFile(isExist.thumbnail_image)
      --------END------------------------------------------------------*/

      return success(res, languageCode, undefined, 'RECORD_SUCCESSFULLY_DELETED')
    } catch (error) {
      console.error('🐛 ERROR 🐛', error)
      return internalServer(res, languageCode, req.body, undefined, (error as Error).message)
    }
  }
}
const eventController = new EventController()
export default eventController
