export interface IEvent {
  id: string

  thumbnail_image: string
  title: string
  description: string
  city: string
  state: string
  country: string
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
  city: string
  state: string
  country: string
  event_date: Date
  submittedAt?: Date
  publishedAt?: Date
  qr_code_image?: string
  status: string
  createdAt?: Date
  updatedAt?: Date
}
