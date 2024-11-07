import { DataTypes, Model } from 'sequelize'
import { v4 as uuidv4 } from 'uuid'
import sequelize from '../config/database'
import NewsCategory from './news_category.model'
import User from './user.model'
import { NEWS_STATUS } from '../helpers/constant'
import { INews, ICreateNews } from '../types/news.interface'

class News extends Model<ICreateNews> implements INews {
  public id!: string
  public title!: string
  public news_description!: string
  public news_image!: string
  public status!: string
  public submittedAt!: Date
  public publishedAt!: Date | null
}

News.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    news_description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    news_image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM,
      values: Object.values(NEWS_STATUS),
      defaultValue: NEWS_STATUS.DRAFT,
      allowNull: false,
    },
    reason_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'news',
    timestamps: true,

    hooks: {
      beforeCreate: (news) => {
        news.id = uuidv4()
        if (news.status === NEWS_STATUS.PUBLISHED) {
          news.publishedAt = new Date()
        } else {
          news.publishedAt = null
        }
      },
      afterUpdate: (news) => {
        if (news.status === NEWS_STATUS.PUBLISHED) {
          news.publishedAt = new Date()
        } else {
          news.publishedAt = null
        }
      },
    },
  }
)

// Associations
News.belongsTo(NewsCategory, {
  foreignKey: 'news_category_id',
  as: 'news_category',
  onDelete: 'CASCADE',
})
NewsCategory.hasMany(News, {
  foreignKey: 'news_category_id',
  as: 'news',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
})

News.belongsTo(User, {
  foreignKey: 'creator_id',
  as: 'creator',
  onDelete: 'CASCADE',
})
// User Association
User.hasMany(News, {
  foreignKey: 'creator_id',
  as: 'news_data',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
})

export default News
