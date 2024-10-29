import { FindOptions, Op, WhereOptions } from 'sequelize'
import { IPagination, IResponseAndCount } from '../types/common.interface'
import { ICreateEvent, IEvent, IResponseEvent } from '../types/event.interface'
import Event from '../models/event.model'
import EventAssets from '../models/event_assets.model'
import { ICreateEventAssets, IEventAssets } from '../types/event_assets.interface'
import User from '../models/user.model'
import EventCategory from '../models/event_category.model'

class EventService {
  async create(payload: ICreateEvent): Promise<IEvent> {
    const eventCategory = await Event.create(payload)
    return eventCategory
  }

  async bulkCreateEventAssets(payload: ICreateEventAssets[]): Promise<IEventAssets[]> {
    const eventAssets = await EventAssets.bulkCreate(payload)
    return eventAssets
  }

  async findOne(data: FindOptions<ICreateEvent>): Promise<IEvent | null> {
    return await Event.findOne(data)
  }

  async findEeventDetails(options: {}): Promise<IResponseEvent | null> {
    return await Event.findOne({
      where: options,
      include: [
        {
          model: EventCategory,
          as: 'event_category',
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
        {
          model: EventAssets,
          as: 'event_assets',
          attributes: ['id', 'media_type', 'path'],
        },
      ],
    })
  }

  async findAll(pagination: IPagination): Promise<IResponseAndCount<IEvent[]>> {
    let where: WhereOptions<ICreateEvent> = {}

    if (pagination.status) {
      where = {
        ...where,
        status: pagination.status,
      }
    }
    if (pagination.todayDate) {
      const today = new Date()

      // Get the start of the day
      const startOfDay = today.setHours(0, 0, 0, 0)

      // Get the end of the day
      const endOfDay = today.setHours(23, 59, 59, 999)

      where = {
        ...where,
        event_date: {
          [Op.gte]: startOfDay,
          [Op.lte]: endOfDay,
        },
      }
    }

    if (pagination.isUpcomingEvent) {
      const today = new Date()
      const startOfToday = new Date(today.setHours(0, 0, 0, 0))
      where = {
        ...where,
        event_date: {
          [Op.gt]: startOfToday,
        },
      }
    }
    if (pagination.search) {
      where = {
        ...where,
        [Op.or]: [
          { title: { [Op.like]: `%${pagination.search}%` } },
          { description: { [Op.like]: `%${pagination.search}%` } },
          { location: { [Op.like]: `%${pagination.search}%` } },
        ],
      }
    }

    const filter: FindOptions<ICreateEvent> = {
      where,
      include: [
        {
          model: EventCategory,
          as: 'event_category',
          attributes: ['title', 'icon_image'],
        },
        {
          model: User,
          as: 'creator',
          attributes: [
            'first_name',
            'last_name',
            'profile_image',
            'email',
            'role',
            'country_code',
            'mobile_number',
          ],
        },
      ],
      limit: pagination.limit || 10,
      offset: (pagination.page_number - 1) * pagination.limit || 0,
      order: [['createdAt', 'DESC']],
      nest: true,
    }
    return await Event.findAndCountAll(filter)
  }

  async update(id: string, payload: ICreateEvent): Promise<[affectedCount: number]> {
    return await Event.update(payload, { where: { id } })
  }
  async delete(id: string): Promise<number> {
    return await Event.destroy({ where: { id } })
  }
}

const eventService = new EventService()

export default eventService
