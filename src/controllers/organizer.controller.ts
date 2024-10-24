import { Request, Response } from 'express'
import { badRequest, internalServer, success, unAuthorized } from '../helpers/response'
import { LANGUAGE_CODE, ROLES } from '../helpers/constant'
import organizerService from '../services/organizer.service'
import { generateRandomString, metaDataForPaginations } from '../helpers/common'
import userService from '../services/user.service'
import { encrypt } from '../helpers/encrypt'
import { statusCode } from '../config/statucCode'
import { IPagination } from '../types/common.interface'
import mailTemplateService from '../services/mail_template.service'

class OrganizerController {
  /**************************************************************************
   * REST API endpoint for create a new Oraganizer from the Super Admin side
   * @param req
   * @param res
   * @returns
   **************************************************************************/
  async createOrganizer(req: Request, res: Response) {
    const languageCode: string = (req.headers.languagecode as string) ?? LANGUAGE_CODE.IT
    try {
      const userPayload = req.body

      // Email is already exist or not please check
      const isExistUser = await userService.findOneByEmail(userPayload.email)
      if (isExistUser) {
        return badRequest(res, languageCode, 'EMAIL_EXIST', req.body)
      }
      // Generate a random password for the organizer
      const password = await generateRandomString(10)

      // Encrypt the password to store in database
      userPayload.password = await encrypt(password)

      // Store into the Database
      await userService.create(userPayload)

      // Find record through an email
      const getUser = await userService.findOneByEmail(userPayload.email)
      if (!getUser) {
        return badRequest(res, languageCode, 'USER_NOT_EXIST')
      }

      // Send mail
      const mailBody = {
        email: getUser.email,
        first_name: getUser.first_name,
        last_name: getUser.last_name,
        password: password, // This should be replaced with encrypted password
      }
      await mailTemplateService.sendNewOrganizerMail(mailBody)

      return success(
        res,
        languageCode,
        statusCode.SUCCESS,
        'ORGANIZER_CREATED_SUCCESSFULLY',
        getUser
      )
    } catch (error) {
      return internalServer(res, languageCode, req.body, undefined, (error as Error).message)
    }
  }

  /****************************************************
   * REST API endpoint for get a list of all Organizers
   * @param req
   * @param res
   * @returns
   ****************************************************/
  async getAllOrganizer(req: Request, res: Response) {
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
      const { count, rows } = await userService.findAll(pagination)
      const data = {
        result: rows,
        pagination: await metaDataForPaginations(pagination?.page_number, pagination.limit, count),
      }

      return success(res, languageCode, undefined, 'LIST_OF_ORGANIZER', data)
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
      const getUser = await userService.findOne({
        where: {
          id,
        },
        raw: true,
      })
      if (!getUser) return badRequest(res, languageCode, 'USER_NOT_EXIST')

      return success(res, languageCode, undefined, 'DETAILS_OF_ORGANIZER', getUser)
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
      let userId = req.params.id

      if (req?.user && req.user.role === ROLES.ORGANIZER) userId = req.user.id

      const userUpdated = (await userService.update(userId, req.body))[0]

      // Check weather it was updated or not
      if (!userUpdated) return internalServer(res, languageCode, req.body, 'UNABLE_TO_UPDATE')
      // Fetch an updated record and send as a response
      const result = await userService.findOne({ where: { id: userId }, raw: true })
      return success(res, languageCode, undefined, 'PROFILE_UPDATED_SUCCESS', result)
    } catch (error) {
      console.error('🐛 ERROR 🐛', error)
      return internalServer(res, languageCode, req.body, undefined, (error as Error).message)
    }
  }

  /**
   * REST API endpoint for delete an requested user
   * @param req
   * @param res
   */
  async delete(req: Request, res: Response) {
    const languageCode: string = (req.headers.languagecode as string) ?? LANGUAGE_CODE.IT
    try {
      console.log('REQ.USER : ', req.user)

      if (req.user.role !== ROLES.SUPER_ADMIN) return unAuthorized(res, languageCode)

      if (!req.params.id)
        return internalServer(res, languageCode, req.body, 'INVALID_REQUEST_PARAMS')
      const { id } = req.params
      const result = await userService.delete(id)
      if (!result) return internalServer(res, languageCode, req.body, 'UNABLE_TO_DELETE')
      return success(res, languageCode, undefined, 'RECORD_SUCCESSFULLY_DELETED')
    } catch (error) {
      console.error('🐛 ERROR 🐛', error)
      return internalServer(res, languageCode, req.body, undefined, (error as Error).message)
    }
  }
}

const organizerController = new OrganizerController()
export default organizerController
