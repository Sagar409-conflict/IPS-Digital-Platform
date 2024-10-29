export interface IEventCatgory {
  id: string
  title: string
  icon_image: string
  createdAt: Date
  updatedAt: Date
}

export interface ICreateEventCatgory {
  id?: string
  title: string
  icon_image: string
  createdAt?: Date
  updatedAt?: Date
}
