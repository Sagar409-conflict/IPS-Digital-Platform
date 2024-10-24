import en from './resources/en.json'
import it from './resources/it.json'
import { Response } from 'express'
import { statusCode } from '../config/statucCode'
import { LANGUAGE_CODE } from './constant'

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
    // error: false,
    message: message,
    statusCode: status_code,
    // messageCode: code,
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
    // error: true,
    message: message,
    statusCode: status_code,
    // messageCode: code,
    // data,
    // reqBody,
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
    // error: true,
    message: message,
    statusCode: status_code,
    // messageCode: code,
    // data,
    // reqBody,
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
    // error: true,
    message: message,
    statusCode: status_code,
    // messageCode: code,
    // data,
    // reqBody,
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
    // error: true,
    message: message,
    statusCode: status_code,
    // messageCode: code,
    // data,
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
    // error: true,
    message,
    statusCode: status_code,
    // messageCode: 'VALIDATION_ERROR',
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
    // error: true,
    message: message,
    statusCode: status_code,
    // messageCode: code,
    data,
  }
  return res.status(status_code).json(resData)
}
