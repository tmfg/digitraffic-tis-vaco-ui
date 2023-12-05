import { Entry } from './EntryResource'
import { ItemCounter } from './ItemCounter'
import { Error } from './Error'
import { PackageResource } from './Package'

export interface EntryStateResource {
  data: {
    entry: Entry
    validationReports: ValidationReport[]
    validationPackages: PackageResource[]
  }
  error?: string | null
}

export interface ValidationReport {
  ruleName: string
  ruleDescription: string
  counters: ItemCounter[]
  notices?: Notice[]
}

export interface Notice {
  code: string
  severity: string
  total: number
  instances: Error[]
}
