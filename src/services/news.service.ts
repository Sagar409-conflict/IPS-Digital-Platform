import { FindOptions, Op, WhereOptions } from 'sequelize'
import News from '../models/news.models'
import { ICreateNews, INews, INewsPagination } from '../types/news.interface'
import { IResponseAndCount } from '../types/common.interface'
import User from '../models/user.model'
import NewsCategory from '../models/news_category.model'
import userService from './user.service'
import { ROLES } from '../helpers/constant'

class NewsService {
  // Create a new News entry
  async create(payload: ICreateNews): Promise<INews> {
    return await News.create(payload)
  }

  // Find a single news entry by title
  async findOneByTitle(title: string): Promise<INews | null> {
    const filter: FindOptions<INews> = {
      where: { title },
      raw: true,
    }
    return await News.findOne(filter)
  }

  // Find all news entries with optional search, pagination, and approval status
  async findAll(pagination: INewsPagination): Promise<IResponseAndCount<INews[]>> {
    console.log('🚀 ~ file: news.service.ts:28 ~ NewsService ~ findAll ~ pagination:', pagination)

    let where: WhereOptions<ICreateNews> = {}

    if (pagination.status !== undefined) {
      where = {
        ...where,
        status: pagination.status,
      }
    }
    if (pagination.user_id !== undefined) {
      const user = await userService.getById(pagination.user_id)
      if (user && user.role === ROLES.ORGANIZER) {
        where = {
          ...where,
          creator_id: pagination.user_id,
        }
      }
    }

    if (pagination.news_category_ids !== undefined && pagination.news_category_ids[0] !== '') {
      where = {
        ...where,
        news_category_id: {
          [Op.in]: pagination.news_category_ids,
        },
      }
    }

    if (pagination.search) {
      where = {
        ...where,
        [Op.or]: [
          { title: { [Op.like]: `%${pagination.search}%` } },
          { news_description: { [Op.like]: `%${pagination.search}%` } },
        ],
      }
    }

    const filter: FindOptions<ICreateNews> = {
      where,
      include: [
        {
          model: NewsCategory,
          as: 'news_category',
          attributes: ['title', 'icon_image'],
        },
        {
          model: User,
          as: 'creator',
          attributes: [
            'first_name',
            'last_name',
            'email',
            'country_code',
            'mobile_number',
            'profile_image',
          ],
        },
      ],
      limit: pagination.limit || 10,
      offset: (pagination.page - 1) * pagination.limit || 0,
      // raw: true,
      order: [['createdAt', 'DESC']],
      nest: true,
    }
    return await News.findAndCountAll(filter)
  }

  // Update the status of a news entry (e.g., draft, pending, approved)
  //   async updateStatus(id: string, status: string): Promise<[affectedCount: number]> {
  //     return await News.update({ status }, { where: { id } })
  //   }

  // Update a news entry by ID
  async update(id: string, payload: Partial<ICreateNews>): Promise<[affectedCount: number]> {
    return await News.update(payload, { where: { id } })
  }

  // Delete a news entry by ID
  async delete(newsId: string): Promise<number> {
    return await News.destroy({ where: { id: newsId } })
  }

  // Find a news entry by ID
  // async getById(id: string): Promise<ICreateNews | null> {
  //   return await News.findOne({
  //     where: { id },
  //     attributes: [
  //       'id',
  //       'news_category_id',
  //       'creator_id',
  //       'title',
  //       'news_description',
  //       'news_image',
  //       'status',
  //       'submittedAt',
  //       'publishedAt',
  //       'reason_description',
  //     ],
  //     include: [
  //       {
  //         model: NewsCategory,
  //         as: 'news_category',
  //         attributes: ['title', 'icon_image'],
  //       },
  //       {
  //         model: User,
  //         as: 'creator',
  //         attributes: [
  //           'first_name',
  //           'last_name',
  //           'email',
  //           'country_code',
  //           'mobile_number',
  //           'profile_image',
  //         ],
  //       },
  //     ],
  //   })
  // }
  async getById(id: string): Promise<ICreateNews | null> {
    const news = await News.findOne({
      where: { id },
      attributes: [
        'id',
        'news_category_id',
        'creator_id',
        'title',
        'news_description',
        'news_image',
        'status',
        'submittedAt',
        'publishedAt',
        'reason_description',
      ],
      include: [
        {
          model: NewsCategory,
          as: 'news_category',
          attributes: ['title', 'icon_image'],
        },
        {
          model: User,
          as: 'creator',
          attributes: [
            'first_name',
            'last_name',
            'email',
            'country_code',
            'mobile_number',
            'profile_image',
          ],
        },
      ],
    })

    return news ? news.get({ plain: true }) : null
  }
}

const newsService = new NewsService()
export default newsService
