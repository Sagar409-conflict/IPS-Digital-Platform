import RejectReasons from '../../models/reject_reasons.model'
import { MODULE_IDENTIFIRES } from '../constant'

const seedRejectionReasons = async () => {
  try {
    // Define reasons for each category
    const reasons = [
      { type: MODULE_IDENTIFIRES.EVENT, reason: 'Insufficient details' },
      { type: MODULE_IDENTIFIRES.EVENT, reason: 'Venue issues' },
      { type: MODULE_IDENTIFIRES.EVENT, reason: 'Invalid date' },
      { type: MODULE_IDENTIFIRES.EVENT, reason: 'Duplicate event' },
      { type: MODULE_IDENTIFIRES.EVENT, reason: 'Inappropriate content' },

      { type: MODULE_IDENTIFIRES.NEWS, reason: 'Misleading information' },
      { type: MODULE_IDENTIFIRES.NEWS, reason: 'Unverified source' },
      { type: MODULE_IDENTIFIRES.NEWS, reason: 'Grammar issues' },
      { type: MODULE_IDENTIFIRES.NEWS, reason: 'Inappropriate language' },
      { type: MODULE_IDENTIFIRES.NEWS, reason: 'Duplicate news' },
    ]

    // Seed data for Event model
    await RejectReasons.bulkCreate(reasons, { ignoreDuplicates: true })
  } catch (error) {
    console.error('Error seeding rejection reasons:', error)
  }
}
export default seedRejectionReasons
