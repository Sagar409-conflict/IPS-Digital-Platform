import { DataTypes, Model } from 'sequelize'
import { v4 as uuidv4 } from 'uuid'
import sequelize from '../config/database'
import { ROLES, ROLES_ARRAY } from '../helpers/constant'
import { ICreateUser, IUser } from '../types/user.interface'
// import Agent from '../models/agent.model'

class User extends Model<ICreateUser> implements IUser {
  public id!: string
  public role!: string
  public profile_image!: string
  public first_name!: string
  public last_name!: string
  public email!: string
  public password!: string
  public country_code!: string
  public mobile_number!: string
  public otp!: number | null
  public otp_expire_time!: Date | null
  public status!: number
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profile_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM,
      values: ROLES_ARRAY,
      defaultValue: ROLES.ORGANIZER,
      allowNull: false,
    },
    country_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobile_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otp: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    otp_expire_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    modelName: 'users',
    timestamps: true,
    // paranoid: true,

    scopes: {
      withPassword: {
        attributes: undefined,
      },
    },
    hooks: {
      beforeCreate: async (user) => {
        user.id = uuidv4()
      },
    },
  }
)

export default User
