import sequelize from '../config/database'

const connectDB = async () => {
  try {
    await sequelize.authenticate()
    // await sequelize.sync({ force: false })
    await sequelize.sync({ alter: true, force: false })
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
    throw error
  }
}

export default connectDB
