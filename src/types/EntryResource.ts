import { Phase } from './Phase'
import { Link } from './Link'

export interface EntryResource {
  data: Entry
  links: {
    self: Link
  }
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
