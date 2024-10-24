import { FindOptions, Op, WhereOptions } from 'sequelize'
import User from '../models/user.model'
import { ICreateUser, IUser, IUserResponse } from '../types/user.interface'
import { IPagination, IResponseAndCount } from '../types/common.interface'

class UserService {
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

  async findOne(data: FindOptions<ICreateUser>): Promise<IUserResponse | null> {
    const user = await User.findOne(data)
    if (!user) return user
    const { password, ...userWithoutPassword } = user // Omit password
    return userWithoutPassword
  }

  async findAll(pagination: IPagination): Promise<IResponseAndCount<IUser[]>> {
    let where: WhereOptions<ICreateUser> = {}

    if (pagination.search) {
      console.log('pagination.search : ', pagination.search)
      where = {
        ...where,
        [Op.or]: [
          { first_name: { [Op.like]: `%${pagination.search}%` } },
          { last_name: { [Op.like]: `%${pagination.search}%` } },
          { email: { [Op.like]: `%${pagination.search}%` } },
          { mobile_number: { [Op.like]: `%${pagination.search}%` } },
        ],
      }
    }

    if (pagination.role) {
      console.log('pagination.role : ', pagination.role)
      where = {
        ...where,
        role: pagination.role,
      }
    }

    if (pagination.status) {
      console.log('pagination.status : ', pagination.status)
      where = {
        ...where,
        status: pagination.status,
      }
    }

    const filter: FindOptions<ICreateUser> = {
      where,
      attributes: { exclude: ['password', 'otp', 'otp_expire_time'] },
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
    return await User.destroy({ where: { id: userId } })
  }

  async update(id: string, payload: Partial<ICreateUser>): Promise<[affectedCount: number]> {
    console.log(id, payload)

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

  async getById(id: string): Promise<ICreateUser | null> {
    return User.findOne({
      where: {
        id: id,
      },
      attributes: ['id', 'name', 'email', 'contact_number'],
    })
  }
}

const userService = new UserService()

export default userService