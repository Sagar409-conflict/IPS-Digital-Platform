import { FindOptions, Op, WhereOptions } from 'sequelize'
import NewsCategory from '../models/news_category.model'
import {
  ICreateNewsCategory,
  INewsCategory,
  INewsCategoryResponse,
} from '../types/news_category.interface'
import { IPagination, IResponseAndCount } from '../types/common.interface'
import { IAboutUs, IAboutUsPagination, ICreateAboutUs } from '../types/about_us.interface'
import AboutUs from '../models/about_us.model'
import { count } from 'console'
import { ABOUT_US_PAGES } from '../helpers/constant'

class AboutUsService {
  // Create a new News Category
  async create(payload: ICreateAboutUs): Promise<IAboutUs> {
    const newsCategory = await AboutUs.create(payload)
    return newsCategory
  }
  async bulkCreate(payload: ICreateAboutUs[]): Promise<IAboutUs[]> {
    return await AboutUs.bulkCreate(payload)
  }

  async isAliasAlreadyExists(alias: string): Promise<boolean> {
    const data = await AboutUs.findOne({
      where: { alias },
      raw: true,
    })
    if (data) return false
    return true
  }

  // General find method (can be used with various filters)
  async findOneById(id: string): Promise<IAboutUs | null> {
    return await AboutUs.findOne({
      where: { id },
      raw: true,
    })
  }

  async find(payload: FindOptions<ICreateAboutUs>) {
    return AboutUs.findAll(payload)
  }
  // Find all news categories with optional search and pagination
  async findAll(pagination: IAboutUsPagination): Promise<IAboutUs[]> {
    let where: WhereOptions<ICreateAboutUs> = {
      alias: {
        [Op.ne]: ABOUT_US_PAGES.CHILD_BANNER_IMAGE,
      },
    }

    if (pagination.search) {
      where = {
        ...where,
        [Op.or]: [
          { title: { [Op.like]: `%${pagination.search}%` } },
          { description: { [Op.like]: `%${pagination.search}%` } },
        ],
      }
    }

    const filter: FindOptions<ICreateAboutUs> = {
      where,

      order: [['createdAt', 'ASC']],
      raw: true,
    }
    return await AboutUs.findAll(filter)
  }

  // Delete a news category by ID
  async delete(id: string): Promise<number> {
    const deleted = await AboutUs.destroy({ where: { id } })
    return deleted
  }

  // Update a news category by ID
  async update(id: string, payload: Partial<ICreateAboutUs>): Promise<[affectedCount: number]> {
    console.log('CREATE/UPDATE : ', payload)

    return await AboutUs.update(payload, { where: { id } })
  }

  //   // Find a news category by ID and return specific fields
  async getById(id: string): Promise<IAboutUs | null> {
    return AboutUs.findOne({
      where: { id },
      attributes: ['id', 'alias', 'title', 'description', 'path'],
      raw: true,
    })
  }

  async totalCountOfBnnerImages() {
    return AboutUs.count({
      where: {
        alias: ABOUT_US_PAGES.BANNER_IMAGE,
      },
    })
  }

  async countRecords(payload: FindOptions<ICreateAboutUs>) {
    return AboutUs.count(payload)
  }
}

const aboutUsService = new AboutUsService()

export default aboutUsService
