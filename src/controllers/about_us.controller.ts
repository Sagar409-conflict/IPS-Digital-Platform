import { Request, Response } from 'express'
import { ABOUT_US_PAGES, LANGUAGE_CODE } from '../helpers/constant'
import {
  badRequest,
  customeResponse,
  internalServer,
  notFound,
  success,
  unAuthorized,
  validationErrorResponse,
} from '../helpers/response'
import AboutUsService from '../services/about_us.service'
import { IAboutUs, IAboutUsPagination, ICreateAboutUs } from '../types/about_us.interface'
import { removeFile, uploadFile } from '../helpers/fileUpload'
import { UploadedFile } from 'express-fileupload'
import { statusCode } from '../config/statucCode'
import aboutUsService from '../services/about_us.service'
import { Op } from 'sequelize'

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

  /**
   * REST API endpoint for Get All Sections of About Us
   * @param req
   * @param res
   * @returns
   */
  async getAll(req: Request, res: Response) {
    const languageCode: string = (req.headers.languagecode as string) ?? LANGUAGE_CODE.IT

    try {
      const { search } = req.query
      const pagination: IAboutUsPagination = {
        search: typeof search === 'undefined' ? undefined : String(search),
      }
      const rows = await aboutUsService.findAll(pagination)

      if (rows.length <= 0) return badRequest(res, languageCode, 'UNABLE_TO_FETCH_LIST_DATA')

      const data = {
        result: rows,
      }
      return success(res, languageCode, statusCode.SUCCESS, 'ABOUT_US_LIST', data)
    } catch (error) {
      console.error('🐛 ERROR 🐛', error)
      return internalServer(res, languageCode, req.body, undefined, (error as Error).message)
    }
  }

  /**
   * REST API endpoint for get details of specific section
   * @param req
   * @param res
   * @returns
   */
  async get(req: Request, res: Response) {
    const languageCode: string = (req.headers.languagecode as string) ?? LANGUAGE_CODE.IT

    try {
      const { id } = req.params

      const data = await aboutUsService.getById(id)
      if (!data)
        return notFound(res, languageCode, undefined, undefined, 'ABOUT_US_SECTION_NOT_FOUND')

      //If Banner Images then
      if (data.alias === ABOUT_US_PAGES.BANNER_IMAGE) {
        //Get Sub Images of Banners
        const childBannerImages = await AboutUsService.find({
          where: {
            alias: ABOUT_US_PAGES.CHILD_BANNER_IMAGE,
          },
          attributes: ['id', 'alias', 'path'],
          raw: true,
        })

        const mergedArray = data.path
          ? [{ id: data.id, alias: data.alias, path: data.path }, ...childBannerImages]
          : childBannerImages

        const { path, ...result } = {
          ...data,
          banner_images: mergedArray,
        }

        return success(res, languageCode, undefined, 'ABOUT_US_SECTION_DETAILS', result)
      }
      return success(res, languageCode, undefined, 'ABOUT_US_SECTION_DETAILS', data)
    } catch (error) {
      console.error('🐛 ERROR 🐛', error)
      return internalServer(res, languageCode, req.body, undefined, (error as Error).message)
    }
  }

  async update(req: Request, res: Response) {
    const languageCode: string = (req.headers.languagecode as string) ?? LANGUAGE_CODE.IT

    try {
      const { id } = req.params
      const { alias, title, description } = req.body

      // //Check if the record exists or not
      const section = await AboutUsService.findOneById(id)

      if (!section) return badRequest(res, languageCode, 'ABOUT_US_SECTION_NOT_FOUND')

      // Alias won't be able to modify
      // alias !== ABOUT_US_PAGES.BANNER_IMAGE &&
      if (section.alias !== alias) {
        return customeResponse(
          res,
          languageCode,
          statusCode.INTERNAL_SERVER_ERROR,
          'ABOUT_US_ALIAS_DUPLICATION'
        )
      }

      if (alias === ABOUT_US_PAGES.BANNER_IMAGE && !req.files) {
        return validationErrorResponse(res, 'BANNER_IMAGE_REQUIRED')
      }

      if (
        req.files &&
        req.files.banner_images &&
        Array.isArray(req.files.banner_images) &&
        alias === ABOUT_US_PAGES.BANNER_IMAGE
      ) {
        //Verify length of total images
        if (!(req.files.banner_images.length <= 7))
          return badRequest(res, languageCode, 'ABOUT_US_ALLOW_MAX_7_IMAGES')

        // Verify Already Exist Banner Image
        const alreadyExistImages = await AboutUsService.countRecords({
          where: {
            alias: {
              [Op.in]: [ABOUT_US_PAGES.BANNER_IMAGE, ABOUT_US_PAGES.CHILD_BANNER_IMAGE],
            },
          },
        })

        // DB Total Images Exist and New Images summation should be less than or equal to 7
        if (alreadyExistImages + req.files.banner_images.length > 7)
          return badRequest(res, languageCode, 'ABOUT_US_ALLOW_MAX_7_IMAGES')

        //Get Sub Images of Banners
        const childBannerImages = await AboutUsService.find({
          where: {
            alias: ABOUT_US_PAGES.CHILD_BANNER_IMAGE,
          },
        })

        //Upload all Images to the server
        const payload: ICreateAboutUs[] = await Promise.all(
          req.files.banner_images.map(async (item, index) => {
            const getFilePath = await uploadFile(item, `about_us/banner_images/`)
            if (section.path === null && index === 0) {
              const bannerPayload: ICreateAboutUs = {
                alias,
                title: 'Banner Images',
                path: getFilePath,
              }
              return bannerPayload
            } else {
              const bannerPayload: ICreateAboutUs = {
                alias: ABOUT_US_PAGES.CHILD_BANNER_IMAGE,
                title: '',
                path: getFilePath,
              }
              return bannerPayload
            }
          })
        )
        //Update Existing Image
        if (payload[0].alias === ABOUT_US_PAGES.BANNER_IMAGE) {
          const updateFirstBannerImage = await AboutUsService.update(id, payload[0]) //(comment due to unable to replace old images)
          const addRemainingImages = await AboutUsService.bulkCreate(payload.slice(1))
        } else {
          const addRemainingImages = await AboutUsService.bulkCreate(payload)
        }

        //Remove Unneccessary Old Files from the server
        if (section.path !== null) {
          // await removeFile(section.path) // Main Image Remvoal
          //Below line is commented due to an error (comment/uncomment based on your requirement)
          // await AboutUsService.update(section.id, { path: null })
        }
        // Sub Images need to remove
        if (childBannerImages && childBannerImages.length > 0) {
          await Promise.all(
            childBannerImages.map(async (item) => {
              // await removeFile(item.path)
              // await AboutUsService.delete(item.id)
            })
          )
        }
        return success(res, languageCode, undefined, 'ABOUT_US_UPDATE_SECTION')
      } else {
        // Update Record
        const updateMainImage = (await AboutUsService.update(id, { title, description }))[0]
        if (!updateMainImage)
          return internalServer(res, languageCode, undefined, 'UNABLE_TO_UPDATE')

        return success(res, languageCode, undefined, 'ABOUT_US_UPDATE_SECTION')
      }
    } catch (error) {
      console.error('🐛 ERROR 🐛', error)
      return internalServer(res, languageCode, req.body, undefined, (error as Error).message)
    }
  }

  async delete(req: Request, res: Response) {
    const languageCode: string = (req.headers.languagecode as string) ?? LANGUAGE_CODE.IT
    try {
      const { id } = req.params
      //Check if the record exists or not
      const section = await AboutUsService.findOneById(id)

      if (!section) return badRequest(res, languageCode, 'ABOUT_US_SECTION_NOT_FOUND')

      //Check alias should be banner_image OR child_banner_image
      if (
        [ABOUT_US_PAGES.BANNER_IMAGE, ABOUT_US_PAGES.CHILD_BANNER_IMAGE].includes(section.alias)
      ) {
        await removeFile(section.path)

        let updatePromise: Promise<unknown>
        if (section.alias === ABOUT_US_PAGES.BANNER_IMAGE) {
          updatePromise = AboutUsService.update(id, { path: null })
        } else {
          updatePromise = AboutUsService.delete(section.id)
        }

        await updatePromise
        return success(res, languageCode, undefined, 'ABOUT_US_DELETE_SECTION')
      } else {
        return badRequest(res, languageCode, 'ALIAS_SHOULD_BE_BANNER_IMAGE_OR_CHILD_BANNER_IMAGE')
      }
    } catch (error) {
      console.error('🐛 ERROR 🐛', error)
      return internalServer(res, languageCode, req.body, undefined, (error as Error).message)
    }
  }
}
const aboutUsController = new AboutUsController()
export default aboutUsController
