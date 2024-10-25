import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'
import { internalServer, validationErrorResponse } from '../helpers/response'
import { ROLES, ROLES_ARRAY, USER_STATUS } from '../helpers/constant'

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

const idSchema = Joi.object({
  id: Joi.string().uuid().required(),
})
const statusUpdateSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(USER_STATUS))
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
  title: Joi.string().required().messages({
    'string.base': 'Title should be a type of text.',
    'string.empty': 'Title cannot be empty.',
    'any.required': 'Title is required.',
  }),
  icon_image: Joi.string().optional(),
})

const updateEventCategorySchema = Joi.object({
  id: Joi.string().uuid().required(),
  title: Joi.string().optional().messages({
    'string.base': 'Title should be a type of text.',
    'string.empty': 'Title cannot be empty.',
  }),
  icon_image: Joi.string().optional(),
})
const createNewsCategorySchema = Joi.object({
  title: Joi.string().required().messages({
    'string.base': 'Title should be a type of text.',
    'string.empty': 'Title cannot be empty.',
    'any.required': 'Title is required.',
  }),
  icon_image: Joi.string().optional(),
})
const updateNewsCategorySchema = Joi.object({
  id: Joi.string().uuid().required(),
  title: Joi.string().required().messages({
    'string.base': 'Title should be a type of text.',
    'string.empty': 'Title cannot be empty.',
    'any.required': 'Title is required.',
  }),
  icon_image: Joi.string().optional(),
})
const createEventSchema = Joi.object({
  title: Joi.string().required().messages({
    'string.base': 'Title should be a type of text.',
    'string.empty': 'Title cannot be empty.',
    'any.required': 'Title is required.',
  }),
  event_category_id: Joi.string().required().messages({
    'string.empty': 'Event category cannot be empty.',
    'any.required': 'Event category is required.',
  }),
  description: Joi.string().required().messages({
    'string.empty': 'Description cannot be empty.',
    'any.required': 'Description is required.',
  }),
  city: Joi.string().required().messages({
    'string.base': 'City should be a type of text.',
    'string.empty': 'City cannot be empty.',
    'any.required': 'City is required.',
  }),
  state: Joi.string().required().messages({
    'string.base': 'State should be a type of text.',
    'string.empty': 'State cannot be empty.',
    'any.required': 'State is required.',
  }),
  country: Joi.string().required().messages({
    'string.base': 'Country should be a type of text.',
    'string.empty': 'Country cannot be empty.',
    'any.required': 'Country is required.',
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

const schemas: { [key: string]: Joi.ObjectSchema | Joi.ArraySchema } = {
  id: idSchema,
  statusUpdate: statusUpdateSchema,
  register: registerSchema,
  login: loginSchema,
  resetPassword: resetPasswordSchema,
  createOrganiser: createOrganiserSchema,
  updatedOrganiser: updatedOrganiserSchema,
  createEventCategory: createEventCategorySchema,
  updateEventCategory: updateEventCategorySchema,
  createNewsCategory: createNewsCategorySchema,
  updateNewsCategory: updateNewsCategorySchema,
  createEvent: createEventSchema,
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
