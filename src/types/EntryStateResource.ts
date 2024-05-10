import { EntryResource } from './EntryResource'
import { ItemCounter } from './ItemCounter'
import { Finding } from './Finding.ts'
import { PackageResource } from './Package'
import { SummaryItem } from '../components/ProcessingResults/summary/types'
import { RulesetType } from './Ruleset'

export interface EntryStateResource {
  data: {
    entry: EntryResource
    reports: TaskReport[]
    summaries: SummaryItem[]
    company: string
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
  findings: Finding[]
}
