import { Response } from 'express'

export interface IQueryPagination {
  offset: number
  limit: number
}

export interface IResponseData<T> {
  res: Response
  statusCode: number
  success: number
  message?: string
  languageCode?: string
  data?: T
  error?: string
  pagination?: IPagination
}
export interface IResponse<T> {
  res: Response
  status_code?: number
  code?: number
  message?: string
  languageCode?: string
  data?: T
  error?: string
  pagination?: IPagination
}
export type ResponseStatus = 'success' | 'error'
export interface ISocketResponseData<T> {
  status: ResponseStatus // Status of the response
  message: string // Descriptive message
  timestamp: string // Timestamp of the response
  data?: T | null
}

export interface IResponseAndCount<T> {
  rows: T
  count: number
}

export interface IMediaPath {
  logo: string
  chat_icon: string
  video_icon: string
  audio_icon: string
}
export interface IPagination {
  limit: number
  page_number: number
  total_data?: number
  search?: string
  status?: number
  role?: string
}
export interface IAllMediaFields {
  icon_image?: string
  profile_image?: string
}
