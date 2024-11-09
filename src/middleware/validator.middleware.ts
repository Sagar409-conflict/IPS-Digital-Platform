import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'
import { internalServer, validationErrorResponse } from '../helpers/response'
import {
  ABOUT_US_PAGES,
  EVENT_STATUS,
  MODULE_IDENTIFIRES,
  NEWS_STATUS,
  ROLES,
  ROLES_ARRAY,
  USER_STATUS,
} from '../helpers/constant'

const registerSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  country_code: Joi.string().required(),
  mobile_number: Joi.string().required(),
  role: Joi.string()
    .valid(...ROLES_ARRAY)
    .required(),
})

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})
const updateProfileSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  country_code: Joi.string().required(),
  mobile_number: Joi.string().required(),
})
const idSchema = Joi.object({
  id: Joi.string().uuid().required(),
})
const statusUpdateSchema = Joi.object({
  id: Joi.string().uuid().required(),
  status: Joi.string()
    .valid(...Object.values(USER_STATUS))
    .required(),
  module: Joi.string()
    .valid(...Object.values(MODULE_IDENTIFIRES))
    .required(),
})

const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(5)
    .max(30)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).*$'))
    .required()
    .messages({
      'string.base': 'Password should be a type of text.',
      'string.empty': 'Password cannot be empty.',
      'string.min': 'Password must be at least 5 characters long.',
      'string.max': 'Password cannot exceed 30 characters.',
      'string.pattern.base':
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      'any.required': 'Password is required.',
    }),
})

const changePasswordSchema = Joi.object({
  old_password: Joi.string().required(),
  new_password: Joi.string()
    .min(5)
    .max(30)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).*$'))
    .required()
    .messages({
      'string.base': 'New Password should be a type of text.',
      'string.empty': 'New Password cannot be empty.',
      'string.min': 'New Password must be at least 5 characters long.',
      'string.max': 'New Password cannot exceed 30 characters.',
      'string.pattern.base':
        'New Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      'any.required': 'New Password is required.',
    }),
})

const createOrganiserSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  country_code: Joi.string()
    .pattern(/^\+[1-9][0-9]{0,2}$/)
    .required()
    .messages({
      'string.pattern.base':
        'Country code must start with + followed by 1-3 digits, and cannot contain leading zeros after +.',
      'any.required': 'Country code is required.',
    }),
  mobile_number: Joi.string()
    .length(10) // Require 10 digits
    .pattern(/^[0-9]+$/)
    .messages({
      'string.length': 'Mobile number must be exactly 10 digits long',
      'string.pattern.base': 'Mobile number must contain only digits',
      'any.required': 'Mobile number is required',
    })
    .required(),
})

const updatedOrganiserSchema = Joi.object({
  id: Joi.string().optional(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  country_code: Joi.string()
    .pattern(/^\+[1-9][0-9]{0,2}$/)
    .required()
    .messages({
      'string.pattern.base':
        'Country code must start with + followed by 1-3 digits, and cannot contain leading zeros after +.',
      'any.required': 'Country code is required.',
    }),
  mobile_number: Joi.string()
    .length(10) // Require 10 digits
    .pattern(/^[0-9]+$/)
    .messages({
      'string.length': 'Mobile number must be exactly 10 digits long',
      'string.pattern.base': 'Mobile number must contain only digits',
      'any.required': 'Mobile number is required',
    })
    .required(),
})

const createEventCategorySchema = Joi.object({
  title: Joi.string()
    .pattern(/^[a-zA-Z0-9\s]*$/)
    .required()
    .messages({
      'string.base': 'Title should be a type of text.',
      'string.empty': 'Title cannot be empty.',
      'any.required': 'Title is required.',
      'string.pattern.base': 'Title can only contain alphanumeric characters and spaces',
    }),
  icon_image: Joi.string().optional(),
})

const updateEventCategorySchema = Joi.object({
  id: Joi.string().uuid().required(),
  title: Joi.string()
    .pattern(/^[a-zA-Z0-9\s]*$/)
    .optional()
    .messages({
      'string.base': 'Title should be a type of text.',
      'string.empty': 'Title cannot be empty.',
      'string.pattern.base': 'Title can only contain alphanumeric characters and spaces',
    }),
  icon_image: Joi.string().optional(),
})
const createNewsCategorySchema = Joi.object({
  title: Joi.string()
    .pattern(/^[a-zA-Z0-9\s]*$/)
    .required()
    .messages({
      'string.base': 'Title should be a type of text.',
      'string.empty': 'Title cannot be empty.',
      'any.required': 'Title is required.',
      'string.pattern.base': 'Title can only contain alphanumeric characters and spaces',
    }),
  icon_image: Joi.string().optional(),
})
const updateNewsCategorySchema = Joi.object({
  id: Joi.string().uuid().required(),
  title: Joi.string()
    .pattern(/^[a-zA-Z0-9\s]*$/)
    .optional()
    .messages({
      'string.base': 'Title should be a type of text.',
      'string.empty': 'Title cannot be empty.',
      'string.pattern.base': 'Title can only contain alphanumeric characters and spaces',
    }),
  icon_image: Joi.string().optional(),
})
const createEventSchema = Joi.object({
  title: Joi.string()
    .pattern(/^[a-zA-Z0-9\s]*$/)
    .required()
    .messages({
      'string.base': 'Title should be a type of text.',
      'string.empty': 'Title cannot be empty.',
      'any.required': 'Title is required.',
      'string.pattern.base': 'Title can only contain alphanumeric characters and spaces',
    }),
  event_category_id: Joi.string().required().messages({
    'string.empty': 'Event category cannot be empty.',
    'any.required': 'Event category is required.',
  }),
  description: Joi.string().required().messages({
    'string.empty': 'Description cannot be empty.',
    'any.required': 'Description is required.',
  }),
  location: Joi.string().required().messages({
    'string.base': 'Location should be a type of text.',
    'string.empty': 'Location cannot be empty.',
    'any.required': 'Location is required.',
  }),
  location_coordinates: Joi.string().required().messages({
    'string.base': 'location_coordinates should be a type of text.',
    'string.empty': 'location_coordinates cannot be empty.',
    'any.required': 'location_coordinates is required.',
  }),
  // location_coordinates: Joi.object({
  //   lat: Joi.number().min(-90).max(90).required().messages({
  //     'number.base': `"latitude" should be a number`,
  //     'number.min': `"latitude" should be greater than or equal to -90`,
  //     'number.max': `"latitude" should be less than or equal to 90`,
  //   }),
  //   long: Joi.number().min(-180).max(180).required().messages({
  //     'number.base': `"longitude" should be a number`,
  //     'number.min': `"longitude" should be greater than or equal to -180`,
  //     'number.max': `"longitude" should be less than or equal to 180`,
  //   }),
  // })
  //   .required()
  //   .messages({
  //     'object.base': `"location_coordinates" should be an object`,
  //     'any.required': `"location_coordinates" is required`,
  //   }),
  status: Joi.string()
    .valid(...Object.values(EVENT_STATUS))
    .required()
    .messages({
      'string.empty': 'Status cannot be empty.',
      'any.required': 'Status is required.',
    }),
  event_date: Joi.date()
    .greater('now') // Ensures the date is greater than the current date
    .required()
    .messages({
      'date.greater': 'Event date must be in the future.',
      'date.base': 'Invalid date format.',
      'any.required': 'Event date is required.',
    }),
})
const updateEventSchema = Joi.object({
  id: Joi.string().required(),
  title: Joi.string()
    .pattern(/^[a-zA-Z0-9\s]*$/)
    .required()
    .messages({
      'string.base': 'Title should be a type of text.',
      'string.empty': 'Title cannot be empty.',
      'any.required': 'Title is required.',
      'string.pattern.base': 'Title can only contain alphanumeric characters and spaces',
    }),
  event_category_id: Joi.string().required().messages({
    'string.empty': 'Event category cannot be empty.',
    'any.required': 'Event category is required.',
  }),
  description: Joi.string().required().messages({
    'string.empty': 'Description cannot be empty.',
    'any.required': 'Description is required.',
  }),
  location: Joi.string().required().messages({
    'string.base': 'Location should be a type of text.',
    'string.empty': 'Location cannot be empty.',
    'any.required': 'Location is required.',
  }),
  location_coordinates: Joi.string().required().messages({
    'string.base': 'location_coordinates should be a type of text.',
    'string.empty': 'location_coordinates cannot be empty.',
    'any.required': 'location_coordinates is required.',
  }),
  // location_coordinates: Joi.object({
  //   lat: Joi.number().min(-90).max(90).required().messages({
  //     'number.base': `"latitude" should be a number`,
  //     'number.min': `"latitude" should be greater than or equal to -90`,
  //     'number.max': `"latitude" should be less than or equal to 90`,
  //   }),
  //   long: Joi.number().min(-180).max(180).required().messages({
  //     'number.base': `"longitude" should be a number`,
  //     'number.min': `"longitude" should be greater than or equal to -180`,
  //     'number.max': `"longitude" should be less than or equal to 180`,
  //   }),
  // })
  //   .required()
  //   .messages({
  //     'object.base': `"location_coordinates" should be an object`,
  //     'any.required': `"location_coordinates" is required`,
  //   }),
  status: Joi.string()
    .valid(...Object.values(EVENT_STATUS))
    .required()
    .messages({
      'string.empty': 'Status cannot be empty.',
      'any.required': 'Status is required.',
    }),
  event_date: Joi.date()
    .greater('now') // Ensures the date is greater than the current date
    .required()
    .messages({
      'date.greater': 'Event date must be in the future.',
      'date.base': 'Invalid date format.',
      'any.required': 'Event date is required.',
    }),
})
const updateEventStatusSchema = Joi.object({
  id: Joi.string().required(),
  status: Joi.string().valid('published', 'rejected').required(),
})

const createNewsSchema = Joi.object({
  title: Joi.string()
    .pattern(/^[a-zA-Z0-9\s]*$/)
    .required()
    .messages({
      'string.base': 'Title should be a type of text.',
      'string.empty': 'Title cannot be empty.',
      'any.required': 'Title is required.',
      'string.pattern.base': 'Title can only contain alphanumeric characters and spaces',
    }),
  news_description: Joi.string().required(),
  status: Joi.string()
    .valid(...Object.values(NEWS_STATUS))
    .required(),
  news_category_id: Joi.string()
    .guid({ version: ['uuidv4'] })
    .required(),
})
const updateNewsStatusSchema = Joi.object({
  id: Joi.string().required(),
  status: Joi.string().valid('published', 'rejected').required(),
})
const updateStatusSchema = Joi.object({
  id: Joi.string().required(),
  type: Joi.string().valid(MODULE_IDENTIFIRES.EVENT, MODULE_IDENTIFIRES.NEWS).required().required(),
  status: Joi.string().valid('published', 'rejected').required(),
  reason: Joi.string()
    .when('status', {
      is: 'rejected',
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({
      'any.required': 'Reason is required when status is "rejected".',
      'string.base': 'Reason must be a string.',
    }),
})
const updateNewsSchema = Joi.object({
  id: Joi.string().required(),
  news_category_id: Joi.string().required().messages({
    'string.empty': 'News category cannot be empty.',
    'any.required': 'News category is required.',
  }),
  title: Joi.string()
    .pattern(/^[a-zA-Z0-9\s]*$/)
    .required()
    .messages({
      'string.base': 'Title should be a type of text.',
      'string.empty': 'Title cannot be empty.',
      'any.required': 'Title is required.',
      'string.pattern.base': 'Title can only contain alphanumeric characters and spaces',
    }),
  news_description: Joi.string().required(),
  status: Joi.string().valid('published', 'pending', 'draft').required(),
})

const getRejactionReasonsSchema = Joi.object({
  type: Joi.string().required().messages({
    'string.empty': 'Type cannot be empty.',
    'any.required': 'Type is required.',
  }),
})
const createAboutUsSchema = Joi.object({
  id: Joi.string().required(),
  alias: Joi.string()
    .valid(...Object.values(ABOUT_US_PAGES))
    .required()
    .messages({
      'string.empty': 'Alias cannot be empty.',
      'any.required': 'Alias is required.',
    }),
  title: Joi.string()
    .when('alias', {
      not: ABOUT_US_PAGES.BANNER_IMAGE,
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({
      'any.required': 'Title is required when status is "baner_image".',
      'string.base': 'Title must be a string.',
    }),
  description: Joi.string()
    .when('alias', {
      not: ABOUT_US_PAGES.BANNER_IMAGE,
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({
      'string.empty': 'Description cannot be empty.',
      'any.required': 'Description is required.',
    }),
  // media: Joi.any().when('alias', {
  //   is: ABOUT_US_PAGES.BANNER_IMAGE,
  //   then: Joi.required(),
  //   otherwise: Joi.optional(),
  // }),
})
const createContactUsSchema = Joi.object({
  full_name: Joi.string().required().messages({
    'string.empty': 'Full Name cannot be empty.',
    'any.required': 'Full Name is required.',
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email cannot be empty.',
    'any.required': 'Email is required.',
  }),
  message: Joi.string().required().messages({
    'string.empty': 'Message cannot be empty.',
    'any.required': 'Message is required.',
  }),
})
const schemas: { [key: string]: Joi.ObjectSchema | Joi.ArraySchema } = {
  id: idSchema,
  statusUpdate: statusUpdateSchema,
  register: registerSchema,
  login: loginSchema,
  updateProfile: updateProfileSchema,
  resetPassword: resetPasswordSchema,
  createOrganiser: createOrganiserSchema,
  updatedOrganiser: updatedOrganiserSchema,
  createEventCategory: createEventCategorySchema,
  updateEventCategory: updateEventCategorySchema,
  createNewsCategory: createNewsCategorySchema,
  updateNewsCategory: updateNewsCategorySchema,
  createEvent: createEventSchema,
  createNews: createNewsSchema,
  updateNewsStatus: updateNewsStatusSchema,
  updateNews: updateNewsSchema,
  updateEvent: updateEventSchema,
  updateEventStatus: updateEventStatusSchema,
  updateStatus: updateStatusSchema,
  getRejactionReasons: getRejactionReasonsSchema,
  createAboutUs: createAboutUsSchema,
  updateAboutUs: createAboutUsSchema,
  changePassword: changePasswordSchema,
  createContactUs: createContactUsSchema,
}

export const validate = (schemaName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const schema: Joi.ObjectSchema | Joi.ArraySchema = schemas[schemaName]
    if (!schema) {
      return internalServer(res, undefined, undefined, 'NOT_FOUND_VALIDATION_SCHEMA')
    }

    let data
    if (Joi.isSchema(schema) && schema.type === 'array') {
      data = req.body
    } else {
      data = {
        ...req.body,
        ...req.params,
        ...req.query,
      }
    }

    const { error } = schema.validate(data)
    if (error) {
      return validationErrorResponse(res, error.details[0].message)
    }

    next()
  }
}
