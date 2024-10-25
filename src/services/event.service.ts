import { FindOptions, Op, WhereOptions } from 'sequelize'
import { IPagination, IResponseAndCount } from '../types/common.interface'
import { ICreateEvent, IEvent } from '../types/event.interface'
import Event from '../models/event.model'
import EventAssets from '../models/event_assets.model'
import { ICreateEventAssets, IEventAssets } from '../types/event_assets.interface'

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
}

const eventService = new EventService()

export default eventService
