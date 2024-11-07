export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ORGANIZER: 'organizer',
}
export const ROLES_ARRAY = [ROLES.SUPER_ADMIN, ROLES.ORGANIZER]
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
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
export const EVENT_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  PUBLISHED: 'published',
  REJECTED: 'rejected',
}
export const EVENT_MEDIA_TYPE = {
  IMAGE: 'image',
  VIDEO: 'video',
} as const

export const NEWS_STATUS = {
  PUBLISHED: 'published',
  PENDING: 'pending',
  REJECTED: 'rejected',
  DRAFT: 'draft',
} as const

export const ABOUT_US_PAGES = {
  ABOUT: 'about',
  BANNER_IMAGE: 'banner_image',
  CHILD_BANNER_IMAGE: 'child_banner_image',
  CULTURE: 'culture',
  HISTORY: 'history',
  TERRITORY: 'territory',
  TOUR: 'tour',
  TOURIST: 'tourist',
}

export type EventStatus = keyof typeof NEWS_STATUS
