export interface Task {
  name: string
  priority: number
  created: string
  started: string
  updated: string
  completed: string
  status: Status
}

export enum Status {
  Cancelled = 'cancelled',
  Errors = 'errors',
  Failed = 'failed',
  Processing = 'processing',
  Received = 'received',
  Success = 'success',
  Warnings = 'warnings'
}
