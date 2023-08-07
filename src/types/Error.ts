export interface Error {
  publicId: string
  entryId: bigint
  phaseId: bigint
  rulesetId: bigint
  message: string
  raw: object
}
