import { MutableRefObject, useEffect, useState } from 'react'
import { FdsInputChange } from '../../coreui-components/src/fds-input'

export const useSearchInputListener = (searchInputRef: MutableRefObject<HTMLDivElement | null>, apiData: any) => {
  const [searchWord, setSearchWord] = useState<string | null>(null)

  useEffect(() => {
    // Having "apiData" as dependency only serves a purpose of introducing some kind of delay
    // because otherwise searchInputRef.current can be flaky and end up staying null (and hence no listener attached). No idea why
    const searchElement = searchInputRef?.current
    const useInputListener = (e: Event) => {
      const detail = (e as CustomEvent).detail as FdsInputChange
      setSearchWord(detail.value as string)
    }

    if (searchElement && searchElement.getAttribute('listener') !== 'true') {
      searchElement.addEventListener('change', useInputListener)
    }

    return () => {
      searchElement?.removeEventListener('change', useInputListener)
    }
  }, [searchInputRef, apiData])

  return [searchWord] as const
}
