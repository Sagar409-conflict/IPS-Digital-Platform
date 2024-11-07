import { Request, Response } from 'express'
import { ABOUT_US_PAGES, LANGUAGE_CODE } from '../helpers/constant'
import {
  badRequest,
  internalServer,
  notFound,
  success,
  unAuthorized,
  validationErrorResponse,
} from '../helpers/response'
import AboutUsService from '../services/about_us.service'
import { ICreateAboutUs } from '../types/about_us.interface'
import { uploadFile } from '../helpers/fileUpload'
import { UploadedFile } from 'express-fileupload'
import { statusCode } from '../config/statucCode'

class AboutUsController {
  /**
   * REST API endpoint for create content for about us sections
   * STEPS:
   * (1) Validate "TYPE" is already exists or what?
   * (2) Valdiate Media and Payload
   * (3) IF there are medias then upload and get proper path
   * (4) Take entry in Database
   * @param req
   * @param res
   * @returns
   */
  async create(req: Request, res: Response) {
    const languageCode: string = (req.headers.languagecode as string) ?? LANGUAGE_CODE.IT

    try {
      const { alias, title, description } = req.body

      //(1) Validate "TYPE" is already exists or what?
      if (alias !== ABOUT_US_PAGES.BANNER_IMAGE) {
        const isExist = await AboutUsService.isAliasAlreadyExists(alias)
        if (!isExist) return badRequest(res, languageCode, 'PAGE_SECTION_ALREADY_EXIST')
      }

      //(2) Valdiate Media and Payload
      if (alias === ABOUT_US_PAGES.BANNER_IMAGE && !req.files) {
        return validationErrorResponse(res, 'BANNER_IMAGE_REQUIRED')
      } else if (
        alias === ABOUT_US_PAGES.BANNER_IMAGE &&
        req.files &&
        Array.isArray(req.files.media) &&
        req.files.media.length === req.body.media.length
      ) {
        const payload: ICreateAboutUs[] = await Promise.all(
          req.files.media.map(async (item, index) => {
            const getFilePath = await uploadFile(item, `about_us/banner_images/`)
            const bannerPayload: ICreateAboutUs = {
              alias,
              title: req.body.media[index].title,
              path: getFilePath,
            }
            return bannerPayload
          })
        )

        const created = await AboutUsService.bulkCreate(payload)
        if (!created) return internalServer(res, languageCode, req.body, undefined, 'UNABLE')

        return success(res, languageCode, undefined, 'BANNER_IMAGES_UPLOADED')
      } else if (alias !== ABOUT_US_PAGES.BANNER_IMAGE) {
        const aboutUsPayload: ICreateAboutUs = {
          alias,
          title,
          description,
        }
        const created = await AboutUsService.create(aboutUsPayload)
        if (!created)
          return internalServer(res, languageCode, req.body, undefined, 'UNABLE_TO_CREATE')
        return success(res, languageCode, undefined, 'ABOUT_US_SECTION_CREATED')
      } else {
        return badRequest(res, languageCode, 'ACCESS_DENIED')
      }
    } catch (error) {
      console.error('🐛 ERROR 🐛', error)
      return internalServer(res, languageCode, req.body, undefined, (error as Error).message)
    }
  }

  async getAll(req: Request, res: Response) {
    const languageCode: string = (req.headers.languagecode as string) ?? LANGUAGE_CODE.IT

    try {
    } catch (error) {
      console.error('🐛 ERROR 🐛', error)
      return internalServer(res, languageCode, req.body, undefined, (error as Error).message)
    }
  }
}
const aboutUsController = new AboutUsController()
export default aboutUsController
