import { DataTypes, Model } from 'sequelize'
import { v4 as uuidv4 } from 'uuid'
import sequelize from '../config/database'
import { MODULE_IDENTIFIRES } from '../helpers/constant'
import { ICreateRejectReasons, IRejectReasons } from '../types/reject_reasons.interface'

class RejectReasons extends Model<ICreateRejectReasons> implements IRejectReasons {
  public id!: string
  public type!: string
  public reason!: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

RejectReasons.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM,
      values: [MODULE_IDENTIFIRES.EVENT, MODULE_IDENTIFIRES.NEWS],
      defaultValue: MODULE_IDENTIFIRES.EVENT,
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'reject_reasons',
    timestamps: true,
    // paranoid: true,

    hooks: {
      beforeCreate: async (reason) => {
        reason.id = uuidv4()
      },
    },
  }
)

export default RejectReasons
