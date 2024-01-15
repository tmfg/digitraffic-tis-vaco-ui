import { EntryResource } from './EntryResource'
import { ItemCounter } from './ItemCounter'
import { Finding } from './Finding.ts'
import { PackageResource } from './Package'
import { SummaryItem } from '../components/ProcessingResults/summary/types'

export interface EntryStateResource {
  data: {
    entry: EntryResource
    reports: RuleReport[]
    summaries: SummaryItem[]
  }
  error?: string | null
}

export interface RuleReport {
  ruleName: string
  ruleDescription: string
  ruleType: string
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
