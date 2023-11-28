import { Phase } from './Phase'
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
  conversion?: object
  metadata?: object
  phases: Phase[]
  created: string
  started: string
  updated: string
  completed: string
}

export interface ValidationInput {
  name: string
  config: object | null
}
