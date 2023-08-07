import { Phase } from './Phase'
import { Link } from './Link'
import { Error } from './Error'

export interface EntryResource {
  data: EntryResourceData
  links: {
    self: Link
  }
}

export interface EntryResourceData {
  publicId: string
  url: string
  format: string
  businessId: string
  etag: string
  validation?: object
  conversion?: object
  metadata?: object
  phases: Phase[]
  errors: Error[]
  created: string
  started: string
  updated: string
  completed: string
}
