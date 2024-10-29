import { Request, Response } from 'express'
import { LANGUAGE_CODE, MODULE_IDENTIFIRES, ROLES } from '../helpers/constant'
import { internalServer, success, unAuthorized } from '../helpers/response'
import userService from '../services/user.service'

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
}
const commonController = new CommonController()
export default commonController
