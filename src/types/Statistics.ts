export interface StatusStatistics {

  status: string,
  count: number,
  timestamp: string
  unit: string

}

export interface StatResource {
  data: StatusStatistics
}
