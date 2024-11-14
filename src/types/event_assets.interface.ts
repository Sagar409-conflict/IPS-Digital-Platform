export interface IEventAssets {
  id: string
  media_type: string
  path: string
  file_name: string | null
  video_thumbnail_path: string
  createdAt: Date
  updatedAt: Date
}

export interface ICreateEventAssets {
  id?: string
  event_id?: string
  media_type: string
  path: string
  file_name: string | null
  video_thumbnail_path?: string | null
  createdAt?: Date
  updatedAt?: Date
}

export interface AssetPayload {
  event_id: string
  media_type: string
  path: string
  video_thumbnail_path: string | null
  file_name: string | null
}
