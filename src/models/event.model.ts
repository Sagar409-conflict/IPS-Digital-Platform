import { DataTypes, Model } from 'sequelize'
import { v4 as uuidv4 } from 'uuid'
import sequelize from '../config/database'
import { ICreateEvent, IEvent } from '../types/event.interface'
import { EVENT_STATUS } from '../helpers/constant'
import EventCategory from './event_category.model'
import User from './user.model'

class Event extends Model<ICreateEvent> implements IEvent {
  public id!: string
  public thumbnail_image!: string
  public title!: string
  public description!: string
  public city!: string
  public state!: string
  public country!: string
  public event_date!: Date
  public submittedAt!: Date
  public publishedAt!: Date
  public qr_code_image!: string
  public status!: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Event.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    thumbnail_image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    event_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    qr_code_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM,
      values: Object.values(EVENT_STATUS),
      defaultValue: EVENT_STATUS.DRAFT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'events',
    timestamps: true,
    // paranoid: true,
    hooks: {
      beforeCreate: async (event) => {
        event.id = uuidv4()
      },
    },
  }
)

//Event Categories Association
Event.hasMany(EventCategory, {
  foreignKey: 'event_category_id',
  as: 'event_categories',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
})
EventCategory.belongsTo(Event, {
  foreignKey: 'event_category_id',
  as: 'event',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
})

// User Association
User.hasMany(Event, {
  foreignKey: 'creator_id',
  as: 'events',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
})
Event.belongsTo(User, {
  foreignKey: 'creator_id',
  as: 'creator',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
})

export default Event
