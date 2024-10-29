import { FindOptions, Op, WhereOptions } from 'sequelize'
import News from '../models/news.models'
import { ICreateNews, INews, INewsResponse } from '../types/news.interface'
import { IPagination, IResponseAndCount } from '../types/common.interface'

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
  async findAll(pagination: IPagination): Promise<IResponseAndCount<INews[]>> {
    let where: WhereOptions<ICreateNews> = {}

    if (pagination.search) {
      where = {
        ...where,
        [Op.or]: [{ title: { [Op.like]: `%${pagination.search}%` } }],
      }
    }

    const filter: FindOptions<ICreateNews> = {
      where,
      limit: pagination.limit || 10,
      offset: (pagination.page - 1) * pagination.limit || 0,
      raw: true,
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
  async getById(id: string): Promise<INews | null> {
    return await News.findOne({
      where: { id },
      attributes: ['id', 'title', 'news_description', 'news_image', 'status'],
    })
  }
}

const newsService = new NewsService()
export default newsService
