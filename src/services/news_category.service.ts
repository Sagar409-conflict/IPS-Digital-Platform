import { FindOptions, Op, WhereOptions } from 'sequelize'
import NewsCategory from '../models/news_category.model'
import { ICreateNewsCategory, INewsCategory, INewsCategoryResponse } from '../types/news_category.interface'
import { IPagination, IResponseAndCount } from '../types/common.interface'

class NewsCategoryService {
  // Create a new News Category
  async create(payload: ICreateNewsCategory): Promise<INewsCategory> {
    const newsCategory = await NewsCategory.create(payload)
    return newsCategory
  }

  // Find a single news category by title
  async findOneByTitle(title: string): Promise<INewsCategory | null> {
    const filter: FindOptions<INewsCategory> = {
      where: { title },
      raw: true,
    }
    return await NewsCategory.findOne(filter)
  }

  // General find method (can be used with various filters)
  async findOne(data: FindOptions<ICreateNewsCategory>): Promise<INewsCategory | null> {
    return await NewsCategory.findOne(data)
  }

  // Find all news categories with optional search and pagination
  async findAll(pagination: IPagination): Promise<IResponseAndCount<INewsCategory[]>> {
    let where: WhereOptions<ICreateNewsCategory> = {}

    if (pagination.search) {
      where = {
        ...where,
        [Op.or]: [{ title: { [Op.like]: `%${pagination.search}%` } }],
      }
    }

    const filter: FindOptions<ICreateNewsCategory> = {
      where,
      limit: pagination.limit || 10,
      offset: (pagination.page_number - 1) * pagination.limit || 0,
      order: [['createdAt', 'DESC']],
      raw: true,
    }
    return await NewsCategory.findAndCountAll(filter)
  }

  // Delete a news category by ID
  async delete(categoryId: string): Promise<number> {
    const deleted = await NewsCategory.destroy({ where: { id: categoryId } })
    return deleted
  }

  // Update a news category by ID
  async update(id: string, payload: Partial<ICreateNewsCategory>): Promise<[affectedCount: number]> {
    return await NewsCategory.update(payload, { where: { id } })
  }

//   // Find a news category by ID and return specific fields
  async getById(id: string): Promise<INewsCategory | null> {
    return NewsCategory.findOne({
      where: { id },
      attributes: ['id', 'title', 'icon_image'],
    })
  }

  // Find a news category that includes soft-deleted records
  async findOneWithDeleted(payload: Partial<ICreateNewsCategory>): Promise<INewsCategory | null> {
    return await NewsCategory.findOne({
      where: { ...payload },
      paranoid: false,
    })
  }
}

const newsCategoryService = new NewsCategoryService()

export default newsCategoryService
