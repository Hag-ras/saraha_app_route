import { resolve} from 'node:path'
import { config } from 'dotenv'

export const NODE_ENV = process.env.NODE_ENV?? 'development'
config({path: resolve(`.env.${process.env.NODE_ENV?? 'development'}`)})


const env = process.env
export const PORT = parseInt(env.PORT?? 3000)

export const DB_URI = env.DB_URI
export const SALT = parseInt(env.SALT?? 12)
export const ENC_KEY = env.ENC_KEY
export const IV_LENGTH = parseInt(env.IV_LENGTH?? 16)

export const ACCESS_USER_TOKEN_SIGNATURE = env.ACCESS_USER_TOKEN_SIGNATURE;
export const REFRESH_USER_TOKEN_SIGNATURE = env.REFRESH_USER_TOKEN_SIGNATURE;
export const ACCESS_ADMIN_TOKEN_SIGNATURE = env.ACCESS_ADMIN_TOKEN_SIGNATURE;
export const REFRESH_ADMIN_TOKEN_SIGNATURE = env.REFRESH_ADMIN_TOKEN_SIGNATURE;


export const ACCESS_TOKEN_EXPIRES_IN = parseInt(env.ACCESS_TOKEN_EXPIRES_IN)
export const REFRESH_TOKEN_EXPIRES_IN = parseInt(env.REFRESH_TOKEN_EXPIRES_IN?? 86400*365)
