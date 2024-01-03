import { KeyValuePairItem } from '../../Common/KeyValuePairs/KeyValuePairs'

export interface SummaryItem {
  title: string
  type: string
  content: object | SummaryCard | null | KeyValuePairItem[] | string[]
}

export interface SummaryCard {
  title: string
  content: KeyValuePairItem[]
}
