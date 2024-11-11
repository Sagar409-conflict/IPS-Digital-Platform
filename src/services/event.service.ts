import { col, FindOptions, fn, Op, WhereOptions } from 'sequelize'
import { IPagination, IResponseAndCount } from '../types/common.interface'
import { ICreateEvent, IEvent, IEventPagination, IResponseEvent } from '../types/event.interface'
import Event from '../models/event.model'
import EventAssets from '../models/event_assets.model'
import { ICreateEventAssets, IEventAssets } from '../types/event_assets.interface'
import User from '../models/user.model'
import EventCategory from '../models/event_category.model'
import userService from './user.service'
import { ROLES } from '../helpers/constant'

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

  async findEeventDetails(options: {}): Promise<ICreateEvent | null> {
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
          attributes: ['id', 'media_type', 'path', 'video_thumbnail_path'],
        },
      ],
      raw: false,
      nest: true,
    })
  }

  async findAll(pagination: IEventPagination): Promise<IResponseAndCount<IEvent[]>> {
    let where: WhereOptions<ICreateEvent> = {}

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
    if (
      pagination.event_category_ids !== undefined &&
      pagination.event_category_ids[0] !== undefined
    ) {
      where = {
        ...where,
        event_category_id: {
          [Op.in]: pagination.event_category_ids,
        },
      }
    }
    if (pagination.isTodayEvent !== undefined) {
      const today = new Date()

      const startOfDay = new Date(
        Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 0, 0, 0, 0)
      )

      // End of day in UTC
      const endOfDay = new Date(
        Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 23, 59, 59, 999)
      )

      where = {
        ...where,
        event_date: {
          [Op.gte]: startOfDay,
          [Op.lte]: endOfDay,
        },
      }
    }

    if (pagination.isUpcomingEvent !== undefined) {
      const today = new Date()
      const isTodayEvent = new Date(
        Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 23, 59, 59, 999)
      )
      where = {
        ...where,
        event_date: {
          [Op.gt]: isTodayEvent,
        },
      }
    }
    if (pagination.search !== undefined) {
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
      offset: (pagination.page - 1) * pagination.limit || 0,
      order: [['createdAt', 'DESC']],
      nest: true,
    }
    return await Event.findAndCountAll(filter)
  }

  async update(id: string, payload: Partial<ICreateEvent>): Promise<[affectedCount: number]> {
    return await Event.update(payload, { where: { id } })
  }

  async getEventAsset(options: {}): Promise<ICreateEventAssets | null> {
    return await EventAssets.findOne(options)
  }
  async getAssets(options: {}): Promise<ICreateEventAssets[]> {
    return await EventAssets.findAll(options)
  }
  async delete(id: string): Promise<number> {
    return await Event.destroy({ where: { id } })
  }
  async deleteEventAssets(payload: {}): Promise<number> {
    return await EventAssets.destroy(payload)
  }
  async replaceAssetsPathFolderName(
    event_id: string,
    old_string: string,
    new_string: string
  ): Promise<[affectedCount: number]> {
    return await EventAssets.update(
      {
        path: fn('REPLACE', col('path'), old_string, new_string),
      },
      {
        where: {
          event_id,
        },
      }
    )
  }
}

const eventService = new EventService()

export default eventService
