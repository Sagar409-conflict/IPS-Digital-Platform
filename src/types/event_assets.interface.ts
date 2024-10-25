export interface IEventAssets {
  id: string
  media_type: string
  path: string
  createdAt: Date
  updatedAt: Date
}

export interface ICreateEventAssets {
  id?: string
  event_id?: string
  media_type: string
  path: string
  createdAt?: Date
  updatedAt?: Date
}
