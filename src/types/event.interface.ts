import { ICreateEventAssets, IEventAssets } from './event_assets.interface'
import { IUserResponse } from './user.interface'

export interface IEvent {
  id: string
  thumbnail_image: string
  title: string
  description: string
  location: string
  location_coordinates: string
  event_date: Date
  submittedAt: Date
  publishedAt: Date | null
  qr_code_image: string
  status: string
  reason_description: string
  createdAt: Date
  updatedAt: Date
}

export interface ICreateEvent {
  id?: string
  creator_id?: string
  event_category_id?: string
  thumbnail_image: string
  title: string
  description: string
  location: string
  location_coordinates: string
  event_date: Date
  submittedAt?: Date
  publishedAt?: Date | null
  qr_code_image?: string
  status?: string
  reason_description?: string
  createdAt?: Date
  updatedAt?: Date
  creator?: IUserResponse
  event_assets?: IEventAssets[]
}
export interface IResponseEvent {
  id: string
  thumbnail_image: string
  title: string
  description: string
  location: string
  location_coordinates: string
  event_date: Date
  submittedAt: Date
  publishedAt: Date | null
  qr_code_image: string
  status: string
  reason_description: string
  event_assets?: ICreateEventAssets[]
  createdAt: Date
  updatedAt: Date
}
export type AssetsStatus = {
  thumbnail_image: boolean
  event_images: boolean
  event_videos: boolean
}

export interface IEventPagination {
  limit: number
  page: number
  total_data?: number
  search?: string
  status?: string
  role?: string
  user_id?: string
  event_category_id?: string
  isTodayEvent?: boolean
  isUpcomingEvent?: boolean
}
