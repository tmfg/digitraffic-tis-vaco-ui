import { useEffect, useState } from 'react'
import { FdsNavigationItem, FdsNavigationVariant } from '../../../coreui-components/src/fds-navigation'
import { FdsNavigationComponent } from '../fds/FdsNavigationComponent'
import { useNavigate, useLocation } from 'react-router-dom'
import { MsalMethod } from '../../types/Auth'
import { useMsal } from '@azure/msal-react'

interface NavbarProps {
  items: FdsNavigationItem[]
  barIndex: number
  variant: FdsNavigationVariant
  selectedItem: FdsNavigationItem
  children?: React.ReactNode
  isSelectedItemStatic?: boolean
}

const Navbar = ({
  items,
  barIndex,
  variant,
  selectedItem: initialSelectedItem,
  children,
  isSelectedItemStatic
}: NavbarProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { instance } = useMsal()
  const [selectedItem, setSelectedItem] = useState<FdsNavigationItem>(initialSelectedItem)

  const useSelectListener: EventListenerOrEventListenerObject = (e: Event): void => {
    const detail = (e as CustomEvent).detail as FdsNavigationItem

    if (typeof detail.value !== 'string') {
      // e.g. login or register
      const msalMethod = detail.value as MsalMethod
      msalMethod(instance)
      return
    }

    setSelectedItem(detail)
    const route = detail.value
    if (!route) {
      return
    } else if (route.startsWith('https')) {
      // Redirecting to a new window
      window.open(route, '_newtab')
    } else {
      navigate(route)
    }
  }

  useEffect(() => {
    const element = document.getElementsByTagName('fds-navigation')[barIndex]
    if (element && element.getAttribute('listener') !== 'true') {
      element.addEventListener('select', useSelectListener)
    }

    return () => {
      element?.removeEventListener('select', useSelectListener)
    }
  }, [])

  useEffect(() => {
    if (isSelectedItemStatic) {
      return
    }
    setSelectedItem(items.filter((item) => item.value === location.pathname)[0])
  }, [location, isSelectedItemStatic])

  return (
    <>
      <FdsNavigationComponent
        variant={variant}
        items={items}
        selected={isSelectedItemStatic ? initialSelectedItem : selectedItem}
      >
        {children}
      </FdsNavigationComponent>
    </>
  )
}

export default Navbar
