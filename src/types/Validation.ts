export interface Validation {
  rules: string[]
  results: PhaseResult[]
}

export interface PhaseResult {
  phase: string
  result: never
}
