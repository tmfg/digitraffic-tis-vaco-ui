import { Jwt } from '../types/Jwt'
import { Buffer } from 'buffer'
export const parseJwt = (token: string) => {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = Buffer.from(base64, 'base64').toString()

  return JSON.parse(jsonPayload) as Jwt
}
