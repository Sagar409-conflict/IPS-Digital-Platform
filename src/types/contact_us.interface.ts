export interface IContactUs {
  id: string
  full_name: string
  email: string
  message: string
  createdAt: Date
  updatedAt: Date
}

export interface ICreateContactUs {
  id?: string
  full_name: string
  email: string
  message: string
  createdAt?: Date
  updatedAt?: Date
}
export interface IContactUsPagination {
  limit: number
  page: number
  search?: string
}
