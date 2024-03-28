import { Links } from './Link'

export interface CompanyLatestEntryResource {
  data: CompanyLatestEntry
  links: Links
}

export interface CompanyLatestEntry {
  companyName: string
  businessId: string
  publicId: string | null
  url: string | null
  format: string | null
  convertedFormat: string | null
  status: string | null
  created: string | null
}
