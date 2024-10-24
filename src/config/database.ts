import { Sequelize } from 'sequelize'
import { CONFIG } from './config'

const sequelize = new Sequelize(CONFIG.DB.NAME, CONFIG.DB.USERNAME, CONFIG.DB.PASSWORD, {
  host: CONFIG.DB.HOST,
  dialect: 'mysql',
  logging: false,
})

export default sequelize
