import { EntryResource } from './EntryResource'
import { ItemCounter } from './ItemCounter'
import { Finding } from './Finding.ts'
import { PackageResource } from './Package'

export interface EntryStateResource {
  data: {
    entry: EntryResource
    validationReports: ValidationReport[]
  }
  error?: string | null
}

export interface ValidationReport {
  ruleName: string
  ruleDescription: string
  counters: ItemCounter[]
  notices?: Notice[]
  packages: PackageResource[]
}

export interface Notice {
  code: string
  severity: string
  total: number
  instances: Finding[]
}
