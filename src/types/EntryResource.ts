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
  validations: RuleInput[]
  conversions?: RuleInput[]
  metadata?: object
  tasks?: Task[]
  created: string
  started: string
  updated: string
  completed: string
  badge?: string
  status: string
  context?: string
}

export interface RuleInput {
  name: string
  config: object | null
}
