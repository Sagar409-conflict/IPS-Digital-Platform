import { DataTypes, Model } from 'sequelize'
import { v4 as uuidv4 } from 'uuid'
import sequelize from '../config/database'
import { EVENT_MEDIA_TYPE } from '../helpers/constant'
import { ICreateEventAssets, IEventAssets } from '../types/event_assets.interface'
import Event from './event.model'

type MediaType = (typeof EVENT_MEDIA_TYPE)[keyof typeof EVENT_MEDIA_TYPE]
class EventAssets extends Model<ICreateEventAssets> implements IEventAssets {
  public id!: string
  public media_type!: MediaType
  public path!: string
  public video_thumbnail_path!: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

EventAssets.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    media_type: {
      type: DataTypes.ENUM,
      values: Object.values(EVENT_MEDIA_TYPE),
      defaultValue: EVENT_MEDIA_TYPE.IMAGE,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    video_thumbnail_path: {
      type: DataTypes.STRING, // Store the path to the generated thumbnail
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'event_assets',
    timestamps: true,
    // paranoid: true,

    hooks: {
      beforeCreate: async (eventAsset) => {
        eventAsset.id = uuidv4()
      },
    },
  }
)

//Event Assets Association
Event.hasMany(EventAssets, {
  foreignKey: 'event_id',
  as: 'event_assets',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
})
EventAssets.belongsTo(Event, {
  foreignKey: 'event_id',
})
export default EventAssets
