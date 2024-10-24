import { Request, Response } from 'express'
import { badRequest, internalServer, success } from '../helpers/response'
import { LANGUAGE_CODE, ROLES } from '../helpers/constant'
import { generateRandomString, metaDataForPaginations } from '../helpers/common'
import newsCategoryService from '../services/news_category.service'
import { statusCode } from '../config/statucCode'
import { IPagination } from '../types/common.interface'
import { uploadFile , removeFile} from '../helpers/fileUpload'
import path from 'path'


class NewsCategoryController {
    
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

     const existingCategory = await newsCategoryService.findOneByTitle(payload.title);
      if (existingCategory) {
        return badRequest(res, languageCode, 'NEWS_CATEGORY_EXIST')
      }

      if (
        req.files != undefined &&
        req.files.icon_image !== undefined &&
        !Array.isArray(req.files.icon_image)
      ) {
        payload.icon_image = await uploadFile(req.files.icon_image, `news_category_icons/`)
      } else {
        return badRequest(res, languageCode, req.body, 'MEDIA_NEWS_ICON_REQUIRED')
      }

      await newsCategoryService.create(payload)
      return success(res, languageCode, statusCode.SUCCESS, 'NEWS_CATEGORY_CREATED')
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

      const pagination: IPagination = {
        page_number: typeof page_number === 'undefined' ? 1 : Number(page_number),
        limit: typeof limit === 'undefined' ? 10 : Number(limit),
        search: typeof search === 'undefined' ? undefined : String(search),
        status: typeof status === 'undefined' ? undefined : Number(status),
        role: ROLES.ORGANIZER,
      }

      const { count, rows } = await newsCategoryService.findAll(pagination)
      const data = {
        result: rows,
        pagination: await metaDataForPaginations(pagination?.page_number, pagination.limit, count),
      }
      return success(res, languageCode, statusCode.SUCCESS, 'NEWS_CATEGORY_LIST', data)
    } catch (error) {
      console.error('🐛 ERROR 🐛', error)
      return internalServer(res, languageCode, req.body, undefined, (error as Error).message)
    }
  }

  /**************************************************************************
   * REST API endpoint for create a new event category
   * @param req
   * @param res
   * @returns
   **************************************************************************/
  async getById(req: Request, res: Response){
    const languageCode: string = (req.headers.languagecode as string) ?? LANGUAGE_CODE.IT
    try {
      const { id } = req.params
      const newsCategory = await newsCategoryService.getById(id);

      if (!newsCategory) {
        return badRequest(res, languageCode, 'NEWS_CATEGORY_NOT_FOUND')
      }

      return success(res, languageCode, statusCode.SUCCESS, 'NEWS_CATEGORY_FOUND', newsCategory)
    } catch (error) {
      console.error('��� ERROR ��', error)
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
    try{
      const { id } = req.params
      const newsCategory = await newsCategoryService.getById(id);

      if (!newsCategory) {
        return badRequest(res, languageCode, 'NEWS_CATEGORY_NOT_FOUND')
      }

      if (newsCategory.icon_image) {
        const iconPath = path.join(__dirname, `../public${newsCategory.icon_image}`)
        const removeIconResult = await removeFile(iconPath)
  
        if (removeIconResult.error) {
          return badRequest(res, languageCode, 'Error deleting associated icon image' )
        }
      }
      await newsCategoryService.delete(id)

      return success(res, languageCode, statusCode.SUCCESS, 'NEWS_CATEGORY_DELETED_SUCCESSFULLY', newsCategory)

    }catch(error){
      console.error('��� ERROR ��', error)
      return internalServer(res, languageCode, req.body, undefined, (error as Error).message)
    }
  }

}

const newscategorycontroller = new NewsCategoryController();
export default newscategorycontroller;

