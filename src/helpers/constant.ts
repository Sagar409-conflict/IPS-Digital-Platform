export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ORGANIZER: 'organizer',
}
export const ROLES_ARRAY = [ROLES.SUPER_ADMIN, ROLES.ORGANIZER]
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BLOCKED: 'blocked',
}
export const MODULE_IDENTIFIRES = {
  USER: 'user',
  EVENT: 'event',
  EVENT_CATEGORY: 'event_category',
  NEWS: 'news',
  NEWS_CATEGORY: 'news_category',
}
export const LANGUAGE_CODE = {
  EN: 'en',
  IT: 'it',
}

export const NEWS_STATUS = {
  PUBLISHED: 'published',
  PENDING: 'pending',
  REJECTED: 'rejected',
  DRAFT: 'draft',
} as const

export type EventStatus = keyof typeof NEWS_STATUS
