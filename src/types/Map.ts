import { TableItem } from '../components/Common/Table/Table'

export interface Map {
  [key: string]: string | undefined | boolean | number | string[] | TableItem[][]
}
