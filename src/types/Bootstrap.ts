export interface Bootstrap {
  environment: Environment
  baseUrl: string
  tenantId: string
  clientId: string
}

export enum Environment {
  Local = 'local',
  Dev = 'dev',
  Test = 'tst',
  Prod = 'prd'
}
