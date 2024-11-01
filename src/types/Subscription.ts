import { Company } from './Company.ts'

export interface Subscription {
  type: string
  publicId: string
  subscriber: Company
  resource: Company
}

export interface CreateSubscriptionRequest {
  type: string
  subscriber: string
  resource: string
}
