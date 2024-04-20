import './_filter.scss'
import './_dropdown-menu.scss'
import { HeaderItem } from './Table'
import { useCallback, useEffect, useState } from 'react'
import { ReactComponent as FilterSvg } from '../../../assets/svg/filter.svg'
import { ReactComponent as FilteredSvg } from '../../../assets/svg/filter-x.svg'
import { Map } from '../../../types/Map'
import { useTranslation } from 'react-i18next'

interface FilterComponentProps {
  column: HeaderItem
  tableTitle: string
  filterOptions: string[]
  selectedFilterOptions: string[]
  filterCallback: (selectedFilterOptions: string[]) => void
}

const FilterComponent = ({
  column,
  tableTitle,
  filterOptions,
  selectedFilterOptions,
  filterCallback
}: FilterComponentProps) => {
  const [isClicked, setIsClicked] = useState<boolean>(false)
  const [checkboxStates, setCheckboxStates] = useState<Map>({})
  const { t } = useTranslation()

  const handleOutsideNavigationClick = useCallback(
    (e: Event) => {
      const targets = e.composedPath() as Element[]
      if (
        !targets.some((target) => {
          return (
            target.id === tableTitle + '-filterBy-' + column.name ||
            target.id === tableTitle + '-menu-filterBy-' + column.name
          )
        })
      ) {
        document.removeEventListener('click', handleOutsideNavigationClick)
        setIsClicked(false)
      }
    },
    [column, tableTitle]
  )

  useEffect(() => {
    const menu = document.querySelector('[id="' + tableTitle + '-menu-filterBy-' + column.name + '"]')
    if (menu) {
      document.addEventListener('click', handleOutsideNavigationClick)
    }
    return () => {}
  }, [isClicked, column, handleOutsideNavigationClick, tableTitle])

  useEffect(() => {
    if (Object.keys(checkboxStates).length > 0 || filterOptions.length === 0) {
      return
    }

    const checkboxInitialState: Map = {}
    if (selectedFilterOptions?.length > 0) {
      filterOptions.forEach((opt) => (checkboxInitialState[opt] = selectedFilterOptions.includes(opt)))
    } else {
      filterOptions.forEach((opt) => (checkboxInitialState[opt] = false))
    }

    setCheckboxStates(checkboxInitialState)
    return () => {}
  }, [filterOptions, selectedFilterOptions, checkboxStates])

  return (
    <span id={tableTitle + '-filterBy-' + column.name} className={'filter-wrapper'}>
      <a
        onClick={() => {
          setIsClicked(!isClicked)
        }}
        className={'filter-button ' + (isClicked ? 'filter-button-clicked' : '')}
      >
        {selectedFilterOptions?.length > 0 ? <FilteredSvg /> : <FilterSvg />}
      </a>
      {isClicked && (
        <ul
          id={tableTitle + '-menu-filterBy-' + column.name}
          className={`menu ${column.filterDropdownMenuAlignLeft ? 'menu--aligned' : ''}`}
          // @ts-expect-error
          style={{ '--menu-align-left': column.filterDropdownMenuAlignLeft }}
        >
          {filterOptions.map((opt) => (
            <li key={tableTitle + '-menu-filterBy-' + column.name + '-option-' + opt}>
              <input
                className={'checkbox'}
                type="checkbox"
                id={opt}
                name={opt}
                checked={checkboxStates[opt] as boolean}
                onChange={() => {
                  const newCheckboxStates: Map = { ...checkboxStates }
                  newCheckboxStates[opt] = !checkboxStates[opt]
                  setCheckboxStates(newCheckboxStates)
                  filterCallback(Object.keys(newCheckboxStates).filter((key) => newCheckboxStates[key]))
                }}
              />
              <label htmlFor={opt}>{opt || t('common:notSpecified')}</label>
            </li>
          ))}
        </ul>
      )}
    </span>
  )
}

export default FilterComponent
