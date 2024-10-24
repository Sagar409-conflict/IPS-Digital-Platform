import { FindOptions, Op, WhereOptions } from 'sequelize'
import EventCategory from '../models/event_category.model'
import { IPagination, IResponseAndCount } from '../types/common.interface'
import { ICreateEventCatgory, IEventCatgory } from '../types/event_category.interface'

class EventCategoryService {
  async create(payload: ICreateEventCatgory): Promise<IEventCatgory> {
    const eventCategory = await EventCategory.create(payload)
    return eventCategory
  }

  async findOneWithPassword(email: string): Promise<IEventCatgory | null> {
    const filter: FindOptions = {
      where: {
        email,
        password: {
          [Op.ne]: null,
        },
      },
      raw: true,
    }
    return await EventCategory.scope('withPassword').findOne(filter)
  }

  async findOne(data: FindOptions<ICreateEventCatgory>): Promise<IEventCatgory | null> {
    return await EventCategory.findOne(data)
  }

  async findAll(pagination: IPagination): Promise<IResponseAndCount<IEventCatgory[]>> {
    let where: WhereOptions<ICreateEventCatgory> = {}

    if (pagination.search) {
      where = {
        ...where,
        [Op.or]: [{ title: { [Op.like]: `%${pagination.search}%` } }],
      }
    }

    const filter: FindOptions<ICreateEventCatgory> = {
      where,
      limit: pagination.limit || 10,
      offset: (pagination.page_number - 1) * pagination.limit || 0,
      order: [['createdAt', 'DESC']],
      raw: true,
    }
    return await EventCategory.findAndCountAll(filter)
  }

  async delete(eventCategoryId: string): Promise<number> {
    return await EventCategory.destroy({ where: { id: eventCategoryId } })
  }

  async update(
    id: string,
    payload: Partial<ICreateEventCatgory>
  ): Promise<[affectedCount: number]> {
    console.log(id, payload)

    return await EventCategory.update(payload, { where: { id } })
  }

  async findOneWithDeleted(payload: Partial<ICreateEventCatgory>) {
    return await EventCategory.findOne({
      where: {
        ...payload,
      },
      paranoid: false,
    })
  }

  async updatePassword(id: string, payload: Partial<ICreateEventCatgory>): Promise<void> {
    await EventCategory.update(payload, {
      where: {
        id,
      },
    })
    return
  }

  async getById(id: string): Promise<ICreateEventCatgory | null> {
    return EventCategory.findOne({
      where: {
        id: id,
      },
      attributes: ['id', 'name', 'email', 'contact_number'],
    })
  }
}

const eventCategoryService = new EventCategoryService()

export default eventCategoryService
