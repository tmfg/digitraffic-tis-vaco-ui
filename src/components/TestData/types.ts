export interface EntryRequest {
  url: string
  name?: string
  format: string
  businessId: string
  etag?: string
  validations?: object[]
  conversion?: object
  metadata?: object
}
