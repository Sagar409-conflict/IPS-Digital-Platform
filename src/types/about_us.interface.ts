export interface IAboutUs {
  id: string
  alias: string
  title: string
  description: string
  path: string
  createdAt: Date
  updatedAt: Date
}

export interface ICreateAboutUs {
  id?: string
  alias: string
  title: string
  description?: string
  path?: string
  createdAt?: Date
  updatedAt?: Date
}
