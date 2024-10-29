import { DataTypes, Model } from 'sequelize'
import { v4 as uuidv4 } from 'uuid'
import sequelize from '../config/database'
import { ROLES, ROLES_ARRAY } from '../helpers/constant'
import { ICreateUser, IUser } from '../types/user.interface'
import { ICreateNewsCategory, INewsCategory } from '../types/news_category.interface'
// import Agent from '../models/agent.model'

class NewsCategory extends Model<ICreateNewsCategory> implements INewsCategory {
  public id!: string
  public icon_image!: string
  public title!: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

NewsCategory.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },

    icon_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'news_categories',
    timestamps: true,
    // paranoid: true,

    scopes: {
      withPassword: {
        attributes: undefined,
      },
    },
    hooks: {
      beforeCreate: async (newsCategory) => {
        newsCategory.id = uuidv4()
      },
    },
  }
)

export default NewsCategory
