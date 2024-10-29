import dotenv from 'dotenv'

dotenv.config()

export const CONFIG = {
  DB: {
    NAME: process.env.DB_NAME as string,
    USERNAME: process.env.DB_USERNAME as string,
    PASSWORD: process.env.DB_PASSWORD as string,
    HOST: process.env.DB_HOST as string,
  },
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  JWT_SECRET: process.env.JWT_SECRET as string,
  ADMIN_EMAIL: process.env.ADMINEMAIL,
  ADMIN_PASS: process.env.ADMINPASS,
}
