export interface EntryRequest {
  url: string
  format: string
  businessId: string
  etag: string
  validation?: object
  conversion?: object
  metadata?: object
}
