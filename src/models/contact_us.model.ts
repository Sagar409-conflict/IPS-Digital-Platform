import { DataTypes, Model } from 'sequelize'
import { v4 as uuidv4 } from 'uuid'
import sequelize from '../config/database'
import { IContactUs, ICreateContactUs } from '../types/contact_us.interface'

class ContactUs extends Model<ICreateContactUs> implements IContactUs {
  public id!: string
  public full_name!: string
  public email!: string
  public message!: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

ContactUs.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },

    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'contact_us',
    timestamps: true,
    // paranoid: true,

    hooks: {
      beforeCreate: async (about) => {
        about.id = uuidv4()
      },
    },
  }
)

export default ContactUs
