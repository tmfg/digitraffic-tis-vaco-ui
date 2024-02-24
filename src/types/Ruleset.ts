export interface Ruleset {
  publicId?: string
  identifyingName: string
  description: string
  category: string
  type: string
  format: string
  dependencies: string[]
}

export interface RulesetResource {
  data: Ruleset
}
