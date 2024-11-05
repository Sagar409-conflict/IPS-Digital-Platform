import { MODULE_IDENTIFIRES } from '../helpers/constant'

export interface IRejectReasons {
  id: string
  type: string
  reason: string
  createdAt: Date
  updatedAt: Date
}

export interface ICreateRejectReasons {
  id?: string
  type: string
  reason: string
  createdAt?: Date
  updatedAt?: Date
}
