import { DataTypes, Model } from 'sequelize'
import { v4 as uuidv4 } from 'uuid'
import sequelize from '../config/database'
import { ROLES, ROLES_ARRAY } from '../helpers/constant'
import { ICreateUser, IUser } from '../types/user.interface'
import { ICreateEventCatgory, IEventCatgory } from '../types/event_category.interface'
// import Agent from '../models/agent.model'

class EventCategory extends Model<ICreateEventCatgory> implements IEventCatgory {
  public id!: string
  public icon_image!: string
  public title!: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

EventCategory.init(
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
    modelName: 'event_categories',
    timestamps: true,
    // paranoid: true,

    scopes: {
      withPassword: {
        attributes: undefined,
      },
    },
    hooks: {
      beforeCreate: async (eventCategory) => {
        eventCategory.id = uuidv4()
      },
    },
  }
)

export default EventCategory
