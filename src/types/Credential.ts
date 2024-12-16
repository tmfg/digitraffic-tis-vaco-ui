import { Company } from './Company.ts'

export interface Credential {

  publicId: string
  owner: Company
  name: string
  type: string
  description: string
  details?: AuthenticationDetails

}

export interface UpdateCredentialsRequest {

  type: string
  name: string
  description: string
  owner: string
  details?: AuthenticationDetails

}

export interface AuthenticationDetails {

}

export class HttpBasicAuthenticationDetails implements AuthenticationDetails {
  userId: string
  password: string
}




