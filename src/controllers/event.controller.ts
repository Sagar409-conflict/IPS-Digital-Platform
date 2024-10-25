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
import { uploadAssetsHelper, uploadFile } from '../helpers/fileUpload'
import eventService from '../services/event.service'
import { ICreateEventAssets } from '../types/event_assets.interface'
import { UploadedFile } from 'express-fileupload'

class EventController {
  /**
   * REST API endpoint for create an event
   * @param req
   * @param res
   * @returns
   */
  async create(req: Request, res: Response) {
    const languageCode: string = (req.headers.languagecode as string) ?? LANGUAGE_CODE.IT

    try {
      const payload = req.body

      // Set default values in payload
      payload.creator_id = req.user.id
      payload.status = EVENT_STATUS.DRAFT

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
        console.log('Somethin went wrong in video upload function')
      }

      // Upload event image in EventAssets Table
      const bulkCreationStatusImage = await uploadAssetsHelper(
        req.files.event_images,
        recordCreated.id,
        EVENT_MEDIA_TYPE.IMAGE,
        `event_assets/${payload.title}/event_images/`
      )

      if (!bulkCreationStatusImage.length) {
        console.log('Somethin went wrong in image upload function')
      }

      return success(res, languageCode, undefined, 'EVENT_CREATION_SUCCESS')
    } catch (error) {
      console.error('🐛 ERROR 🐛', error)
      return internalServer(res, languageCode, req.body, undefined, (error as Error).message)
    }
  }
}
const eventController = new EventController()
export default eventController
