import User from '../models/user.model'
import { IUserResponse } from './user.interface'

export interface INews {
  id: string
  title: string
  news_description: string
  news_image: string
  status: string
  reason_description?: string
  submittedAt: Date
  publishedAt: Date | null
}

export interface ICreateNews {
  id?: string
  creator_id?: string
  title: string
  news_description: string
  news_image: string
  status?: string
  reason_description?: string
  submittedAt?: Date
  publishedAt?: Date | null
  creator?: IUserResponse
}

export interface INewsResponse {
  id: string
  title: string
  news_description: string
  status: string
  reason_description: string
  submittedAt: Date
  publishedAt: Date | null
}

export interface INewsDetails {
  id: string
  title: string
  news_description: string
  status: string
  reason_description: string
}

export interface INewsPagination {
  limit: number
  page: number
  total_data?: number
  search?: string
  status?: string
  role?: string
  isTodayEvent?: boolean
  isUpcomingEvent?: boolean
  user_id?: string
}
