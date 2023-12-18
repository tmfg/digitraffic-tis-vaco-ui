import { Task } from './Task'
import { Links } from './Link'

export interface EntryResource {
  data: Entry
  links: Links
}

export interface Entry {
  publicId: string
  name: string
  url: string
  format: string
  businessId: string
  etag: string
  validations: ValidationInput[]
  conversions?: ConversionInput[]
  metadata?: object
  tasks?: Task[]
  created: string
  started: string
  updated: string
  completed: string
  badge?: string
  status: string
}

export interface ValidationInput {
  name: string
  config: object | null
}

export interface ConversionInput {
  name?: string
  config: object | null
}
