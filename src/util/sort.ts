import { getTableItemByColumnName, TableItem } from '../components/Common/Table/Table'

export const sortTableAlphabetically = (data: TableItem[][], property: string, direction: string): typeof data => {
  return direction === 'ASC'
    ? data.sort((a, b) =>
        (getTableItemByColumnName(a, property).value as string).localeCompare(
          getTableItemByColumnName(b, property).value as string
        )
      )
    : data.sort((a, b) =>
        (getTableItemByColumnName(b, property).value as string).localeCompare(
          getTableItemByColumnName(a, property).value as string
        )
      )
}

export const sortTableNumerically = (data: TableItem[][], property: string, direction: string): typeof data => {
  return direction === 'ASC'
    ? data.sort(
        (a, b) =>
          (getTableItemByColumnName(a, property).value as number) -
          (getTableItemByColumnName(b, property).value as number)
      )
    : data.sort(
        (a, b) =>
          (getTableItemByColumnName(b, property).value as number) -
          (getTableItemByColumnName(a, property).value as number)
      )
}

export const sortTableCustom = (
  data: TableItem[][],
  direction: string,
  sortQualifier: (item: TableItem[]) => number
): typeof data => {
  return direction === 'ASC'
    ? data.sort((a, b) => sortQualifier(a) - sortQualifier(b))
    : data.sort((a, b) => sortQualifier(b) - sortQualifier(a))
}
