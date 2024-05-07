export interface Ruleset {
  publicId?: string
  identifyingName: string
  description: string
  category: string
  type: RulesetType
  format: string
  dependencies: string[]
}

export interface RulesetResource {
  data: Ruleset
}

export enum RulesetType {
  ValidationSyntax = 'VALIDATION_SYNTAX',
  ConversionSyntax = 'CONVERSION_SYNTAX'
}

export const GtfsMobilityDataValidatorName = 'gtfs.canonical'
export const NetexEnturValidatorName = 'netex.entur'
export const GbfsEnturValidatorName = 'gbfs.entur'
export const Gtfs2NetexFintrafficConverterName = 'gtfs2netex.fintraffic'
export const Netex2GtfsEnturConverterName = 'netex2gtfs.entur'
