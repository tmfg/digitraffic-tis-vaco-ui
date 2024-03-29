export interface Bootstrap {
  environment: Environment
  baseUrl: string
  tenantId: string
  clientId: string
  buildInfo: string
}

export enum Environment {
  Local = 'local',
  Dev = 'dev',
  Test = 'tst',
  Prod = 'prd'
}
