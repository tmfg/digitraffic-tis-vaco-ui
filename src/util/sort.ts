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
  sortByCustomOrder: (item: TableItem[]) => number
): typeof data => {
  return direction === 'ASC'
    ? data.sort((a, b) => sortByCustomOrder(a) - sortByCustomOrder(b))
    : data.sort((a, b) => sortByCustomOrder(b) - sortByCustomOrder(a))
}

export const sortTableByDate = (data: TableItem[][], property: string, direction: string): typeof data => {
  return direction === 'ASC'
    ? data.sort((a, b) => getDateValue(a, property) - getDateValue(b, property))
    : data.sort((a, b) => getDateValue(b, property) - getDateValue(a, property))
}

const getDateValue = (item: TableItem[], property: string) => {
  const propertyValue = getTableItemByColumnName(item, property).plainValue
  return propertyValue ? new Date(propertyValue as string).getTime() : 0
}
