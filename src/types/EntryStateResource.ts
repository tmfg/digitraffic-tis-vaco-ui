import { ItemCounter } from './ItemCounter'
import { PackageResource } from './Package'
import { SummaryItem } from '../components/ProcessingResults/summary/types'
import { RulesetType } from './Ruleset'
import { Links } from './Link'
import { Status } from './Task'

// The state endpoint returns only the fields the results page shows.
export interface ResultsPageRule {
  name: string
}

export interface ResultsPageTask {
  name: string
  status: Status
  completed: string | null
}

export interface ResultsPageEntry {
  publicId: string
  name: string
  format: string
  url: string
  etag?: string | null
  context?: string
  created: string
  completed: string | null
  tasks: ResultsPageTask[]
  validations: ResultsPageRule[]
  conversions: ResultsPageRule[]
}

export interface ResultsPageEntryResource {
  data: ResultsPageEntry
  links: Links
}

export interface ResultsPageCredentials {
  name: string
}

export interface ResultsPageFinding {
  raw: string
}

export interface EntryStateResource {
  data: {
    entry: ResultsPageEntryResource
    reports: TaskReport[]
    summaries: SummaryItem[]
    company: string
    credentials?: ResultsPageCredentials | null
  }
  error?: string | null
}

export interface TaskReport {
  name: string
  description: string
  type: RulesetType | 'INTERNAL'
  findingCounters: ItemCounter[]
  findings?: AggregatedFinding[]
  packages: PackageResource[]
}

export interface AggregatedFinding {
  code: string
  severity: string
  total: number
  findings: ResultsPageFinding[]
}
