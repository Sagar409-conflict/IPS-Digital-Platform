import sequelize from '../config/database'
import seedAboutUsSections from '../helpers/seeders/SeedAboutUsSections'
import seedRejectionReasons from '../helpers/seeders/SeedRejectionReasons'
import AboutUs from './about_us.model'
import RejectReasons from './reject_reasons.model'

const connectDB = async () => {
  try {
    await sequelize.authenticate()
    // await sequelize.sync({ force: false })
    await sequelize.sync({ alter: true, force: false })
    console.log('Connection has been established successfully.')

    // Check if data exists directly in RejectionReason
    const reasonCount = await RejectReasons.count()
    if (reasonCount === 0) {
      await seedRejectionReasons()
      console.log('Seeding completed Reject Reasons.')
    }
    // Check if data exists directly in AboutUs
    const aboutUsCount = await AboutUs.count()
    if (aboutUsCount === 0) {
      await seedAboutUsSections()
      console.log('Seeding completed About Us Sections.')
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error)
    throw error
  }
}

export default connectDB
