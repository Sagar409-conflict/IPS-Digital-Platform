import { FindOptions, Op, WhereOptions } from 'sequelize'
import User from '../models/user.model'
import { ICreateUser, IUser, IUserResponse } from '../types/user.interface'
import { IPagination, IResponseAndCount } from '../types/common.interface'

class OrganizerService {
  async create(payload: ICreateUser): Promise<IUser> {
    const user = await User.create(payload)
    return user
  }

  async findOneWithPassword(email: string): Promise<IUser | null> {
    const filter: FindOptions = {
      where: {
        email,
        password: {
          [Op.ne]: null,
        },
      },
      raw: true,
    }
    return await User.scope('withPassword').findOne(filter)
  }

  async findOne(data: FindOptions<ICreateUser>): Promise<IUser | null> {
    return await User.findOne(data)
  }

  async findAll(search: string = '', pagination: IPagination): Promise<IResponseAndCount<IUser[]>> {
    const where: WhereOptions<ICreateUser> = {
      [Op.or]: [
        { email: { [Op.like]: `%${search}%` } },
        { first_name: { [Op.like]: `%${search}%` } },
      ],
      role: 'super_admin',
    }

    const filter: FindOptions<ICreateUser> = {
      where,
      limit: pagination.limit || 10,
      offset: (pagination.page_number - 1) * pagination.limit || 0,
      raw: true,
    }
    return await User.findAndCountAll(filter)
  }

  async findOneByEmail(email: string): Promise<IUserResponse | null> {
    const filter: FindOptions<IUserResponse> = {
      where: {
        email,
      },
      raw: true,
    }
    return await User.findOne(filter)
  }

  async delete(userId: string): Promise<number> {
    const user = await User.destroy({ where: { id: userId } })
    return user
  }

  async update(id: string, payload: Partial<ICreateUser>): Promise<[affectedCount: number]> {
    return await User.update(payload, { where: { id } })
  }

  async updateViaEmail(
    email: string,
    payload: Partial<ICreateUser>
  ): Promise<[affectedCount: number]> {
    return await User.update(payload, { where: { email } })
  }

  async findOneWithDeleted(payload: Partial<ICreateUser>) {
    return await User.findOne({
      where: {
        ...payload,
      },
      paranoid: false,
    })
  }

  async updatePassword(id: string, payload: Partial<ICreateUser>): Promise<void> {
    await User.update(payload, {
      where: {
        id,
      },
    })
    return
  }

  async getById(id: string): Promise<IUser | null> {
    return User.findOne({
      where: {
        id: id,
      },
      attributes: ['id', 'name', 'email', 'contact_number'],
    })
  }
}

const organizerService = new OrganizerService()

export default organizerService
