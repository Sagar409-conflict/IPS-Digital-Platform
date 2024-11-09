import { FindOptions, Op, WhereOptions } from 'sequelize'
import { IPagination, IResponseAndCount } from '../types/common.interface'
import { IContactUs, IContactUsPagination, ICreateContactUs } from '../types/contact_us.interface'
import ContactUs from '../models/contact_us.model'

class ContactUsService {
  // Create a contact inquiry
  async create(payload: ICreateContactUs): Promise<IContactUs> {
    const inquiry = await ContactUs.create(payload)
    return inquiry
  }

  async findById(id: string): Promise<IContactUs | null> {
    return await ContactUs.findOne({ where: { id }, raw: true })
  }

  async findAll(pagination: IContactUsPagination): Promise<IResponseAndCount<IContactUs[]>> {
    let where: WhereOptions<IContactUs> = {}

    if (pagination.search) {
      where = {
        ...where,
        [Op.or]: [
          { full_name: { [Op.like]: `%${pagination.search}%` } },
          { email: { [Op.like]: `%${pagination.search}%` } },
          { message: { [Op.like]: `%${pagination.search}%` } },
        ],
      }
    }

    const filter: FindOptions<ICreateContactUs> = {
      where,
      limit: pagination.limit || 10,
      offset: (pagination.page - 1) * pagination.limit || 0,
      order: [['createdAt', 'DESC']],
      nest: true,
    }
    return await ContactUs.findAndCountAll(filter)
  }
}

const contactUsService = new ContactUsService()

export default contactUsService
