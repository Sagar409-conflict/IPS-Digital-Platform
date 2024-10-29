import { NextFunction, Request, Response } from 'express'
import User from '../models/user.model'
import bcrypt from 'bcrypt'
import { IUser } from '../types/user.interface'
import jwt from 'jsonwebtoken'
import userService from '../services/user.service'
import { statusCode } from '../config/statucCode'
import { unAuthorized } from '../helpers/response'
import { LANGUAGE_CODE } from '../helpers/constant'
import { CONFIG } from '../config/config'

export const verifyUser = async (email: string, password: string) => {
  let userInfo = await User.findOne({ where: { email }, raw: true })

  if (userInfo) {
    const isMatch = await bcrypt.compare(password, userInfo.password)
    if (isMatch) return userInfo
    return false
  }
  return false
}

export const generateToken = async (userPayload: IUser) => {
  // eslint-disable-next-line no-undef
  const secret = process.env.JWT_SECRET ?? 'testing_random_key'
  const user = {
    id: userPayload.id,
    first_name: userPayload.first_name,
    last_name: userPayload.last_name,
    email: userPayload.email,
    role: userPayload.role,
  }

  const token = jwt.sign({ user }, secret, {
    expiresIn: '24h',
  })
  return token
}
