import { ValidationInput } from '../../types/EntryResource'

export interface EntryRequest {
  url: string
  name: string
  format: string
  businessId: string
  etag?: string
  validations: ValidationInput[]
  conversion?: object
  metadata?: object
}
