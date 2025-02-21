import { EntryResource } from './EntryResource'
import { ItemCounter } from './ItemCounter'
import { Finding } from './Finding.ts'
import { PackageResource } from './Package'
import { SummaryItem } from '../components/ProcessingResults/summary/types'
import { RulesetType } from './Ruleset'
import { Credential } from './Credential.ts'

export interface EntryStateResource {
  data: {
    entry: EntryResource
    reports: TaskReport[]
    summaries: SummaryItem[]
    company: string
    credentials?: Credential
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
