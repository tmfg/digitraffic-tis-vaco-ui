import { Task } from './Task'
import { Links } from './Link'

export interface Resource<D> {
  data: D
  links: Links
  error?: string
}

export interface CompanyEntriesPage {
  entries: EntrySummary[]
}

export interface EntrySummary {
  publicId: string
  name: string
  context?: string
  status: string
  format: string
  created: string
  started: string | null
  completed: string | null
}

export interface EntryResource {
  data: Entry
  links: Links
}

export interface Entry extends EntrySummary {
  url: string
  businessId: string
  etag: string
  validations?: RuleInput[]
  conversions?: RuleInput[]
  metadata?: object
  tasks?: Task[]
  updated: string
  badge?: string
  credentials?: string
  sendNotifications: boolean
}

export interface RuleInput {
  name: string
  config: object | null
}
