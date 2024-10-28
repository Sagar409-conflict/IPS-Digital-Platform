import { ICreateEventAssets, IEventAssets } from './event_assets.interface'

export interface IEvent {
  id: string

  thumbnail_image: string
  title: string
  description: string
  location: string
  location_coordinates: string
  event_date: Date
  submittedAt: Date
  publishedAt: Date
  qr_code_image: string
  status: string
  createdAt: Date
  updatedAt: Date
}

export interface ICreateEvent {
  id?: string
  thumbnail_image: string
  title: string
  description: string
  location: string
  location_coordinates: string
  event_date: Date
  submittedAt?: Date
  publishedAt?: Date
  qr_code_image?: string
  status: string
  createdAt?: Date
  updatedAt?: Date
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
  publishedAt: Date
  qr_code_image: string
  status: string
  event_assets?: ICreateEventAssets[]
  createdAt: Date
  updatedAt: Date
}
