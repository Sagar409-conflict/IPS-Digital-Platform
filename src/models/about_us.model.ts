import { DataTypes, Model } from 'sequelize'
import { v4 as uuidv4 } from 'uuid'
import sequelize from '../config/database'
import { IAboutUs, ICreateAboutUs } from '../types/about_us.interface'
import { ABOUT_US_PAGES } from '../helpers/constant'

class AboutUs extends Model<ICreateAboutUs> implements IAboutUs {
  public id!: string
  public alias!: string
  public title!: string
  public description!: string
  public path!: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

AboutUs.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    alias: {
      type: DataTypes.ENUM,
      values: Object.values(ABOUT_US_PAGES),
      defaultValue: ABOUT_US_PAGES.ABOUT,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'about_us',
    timestamps: true,
    // paranoid: true,

    hooks: {
      beforeCreate: async (about) => {
        about.id = uuidv4()
      },
    },
  }
)

export default AboutUs
