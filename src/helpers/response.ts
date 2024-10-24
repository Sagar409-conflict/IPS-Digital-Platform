import en from './resources/en.json'
import it from './resources/it.json'

import { Response } from 'express'
import { statusCode } from '../config/statucCode'
import { LANGUAGE_CODE } from './constant'

// export const responseData = <T>(payload: IResponseData<T>) => {
//   const resultObj = {
//     success: payload.success,
//     message: payload.message,
//     result: payload.data,
//     pagination: payload.pagination,
//     error: payload.error,
//   }
//   payload.res.status(payload.statusCode).send(resultObj)
// }

export const responseMessage = (response: string, type = '', module = 'Data') => {
  let return_message
  switch (response) {
    case 'error':
      return_message = `Error in ${type} data`
      break
    case 'success':
      return_message = `${module} ${type} successfully`
      break
    case 'wrong':
      return_message = `Something went wrong.`
      break
    case 'unprocessable_entity':
      return_message = `Unprocessable entity!`
      break
    case 'unauthorize':
      return_message = `Unauthorized!`
      break
    case 'not_found':
      return_message = `No such ${type} exist`
      break
    case 'empty_body':
      return_message = `Please enter some data`
      break
    case 'name_used':
      return_message = `This ${type} is already in use.`
      break
    case 'user_not_matched':
      return_message = 'Invalid username'
      break
    case 'empty_login_body':
      return_message = 'Please enter Username or Password!'
      break
    case 'password_invalid':
      return_message = 'Invalid password'
      break
    case 'user_logged':
      return_message = 'User logged successfully!'
      break
    case 'reset_password':
      return_message = 'Error in reset password'
      break
    case 'email_send':
      return_message = 'Email sent successfully'
      break
    case 'email_send_error':
      return_message = 'Error while sending email'
      break
    case 'password_update':
      return_message = 'Password updated successfully'
      break
    case 'data_update_email_fail':
      return_message = 'Data uploaded successfully but error in sending email'
      break
    case 'missing_id':
      return_message = `Please provide ${type} id`
      break
    case 'session_expired':
      return_message = 'Your session has expired'
      break
    case 'no_access':
      return_message = 'Access denied'
      break
    case 'already_exists':
      return_message = `${type} already exists!`
      break
    case 'same_subscription_plan_exist':
      return_message = 'You already have an active subscription for this plan'
      break
    case 'plan_lemit_reched':
      return_message = 'Agent limit reached for this plan'
      break
    case 'plan_not_found':
      return_message = 'No such plan exist for this user'
      break
    case 'invalid_agent_id':
      return_message = 'Invalid agent Id'
      break
    case 'subscription_not_found':
      return_message = 'You dont have any subscription'
      break
    default:
      return_message = 'No message'
      break
  }
  return return_message
}

const getMessage = (code: string, defaultcode: string, languageCode: string = LANGUAGE_CODE.EN) => {
  if (languageCode === LANGUAGE_CODE.EN) {
    // return en[code] ? en[code] : en[defaultcode]
    return en[code as keyof typeof en]
      ? en[code as keyof typeof en]
      : en[defaultcode as keyof typeof en]
  } else if (languageCode === LANGUAGE_CODE.IT) {
    return it[code as keyof typeof it]
      ? it[code as keyof typeof it]
      : it[defaultcode as keyof typeof it]
  }
}

export const getErrorMessage = (code: string, defaultcode: string, languageCode: string) => {
  return getMessage(code, defaultcode, languageCode)
}

export const success = (
  res: Response,
  languageCode = LANGUAGE_CODE.EN,
  status_code = statusCode.SUCCESS,
  code = '',
  data: object | object[] | null = null,
  message = getMessage(code, 'DEFAULT', languageCode)
) => {
  const resData = {
    error: false,
    message: message,
    statusCode: status_code,
    messageCode: code,
    data,
  }
  return res.status(status_code).json(resData)
}

export const notFound = (
  res: Response,
  languageCode = LANGUAGE_CODE.EN,
  code = '',
  reqBody = {},
  message = getMessage(code, 'DEFAULT', languageCode),
  status_code = statusCode.NOTFOUND,
  data = null
) => {
  const resData = {
    error: true,
    message: message,
    statusCode: status_code,
    messageCode: code,
    data,
    reqBody,
  }
  return res.status(status_code).json(resData)
}

/**
 * Response Design for Bad Request
 */
export const badRequest = (
  res: Response,
  languageCode = LANGUAGE_CODE.EN,
  code = '',
  reqBody = {},
  message = getMessage(code, 'DEFAULT', languageCode),
  status_code = statusCode.BAD_REQUEST,
  data = null
) => {
  const resData = {
    error: true,
    message: message,
    statusCode: status_code,
    messageCode: code,
    data,
    reqBody,
  }
  return res.status(status_code).json(resData)
}

export const unAuthorized = (
  res: Response,
  languageCode = LANGUAGE_CODE.EN,
  reqBody = {},
  code = 'UNAUTHORIZED',
  message = getMessage(code, 'DEFAULT', languageCode),
  status_code = statusCode.UNAUTHORIZED,
  data = null
) => {
  const resData = {
    error: true,
    message: message,
    statusCode: status_code,
    messageCode: code,
    data,
    reqBody,
  }
  return res.status(status_code).json(resData)
}

export const internalServer = (
  res: Response,
  languageCode = LANGUAGE_CODE.EN,
  reqBody = {},
  code = 'DEFAULT_INTERNAL_SERVER_ERROR',
  message = getMessage(code, 'DEFAULT', languageCode),
  status_code = statusCode.INTERNAL_SERVER_ERROR,
  data = null
) => {
  const resData = {
    error: true,
    message: message,
    statusCode: status_code,
    messageCode: code,
    data,
    reqBody,
  }
  return res.status(status_code).json(resData)
}

export const validationErrorResponse = (
  res: Response,
  message = getMessage('VALIDATION_ERROR', 'DEFAULT'),
  status_code = statusCode.UNPROCESSABLE_ENTITY
) => {
  const resData = {
    error: true,
    message,
    statusCode: status_code,
    messageCode: 'VALIDATION_ERROR',
  }
  return res.status(status_code).json(resData)
}

export const customeResponse = (
  res: Response,
  languageCode = LANGUAGE_CODE.EN,
  status_code: number,
  code = 'DEFAULT_INTERNAL_SERVER_ERROR',
  message = getMessage(code, 'DEFAULT', languageCode),
  data = null
) => {
  const resData = {
    error: true,
    message: message,
    statusCode: status_code,
    messageCode: code,
    data,
  }
  return res.status(status_code).json(resData)
}
