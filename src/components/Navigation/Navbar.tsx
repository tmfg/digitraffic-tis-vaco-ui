import { useEffect } from 'react'
import { FdsNavigationItem, FdsNavigationVariant } from '../../../coreui-components/src/fds-navigation'
import { FdsNavigationComponent } from '../fds/FdsNavigationComponent'
import { useNavigate } from 'react-router-dom'
import { MsalMethod } from '../../types/Auth'
import { useMsal } from '@azure/msal-react'

interface NavbarProps {
  items: FdsNavigationItem[]
  barIndex: number
  variant: FdsNavigationVariant
  selectedItem?: FdsNavigationItem
}

const Navbar = ({ items, barIndex, variant, selectedItem }: NavbarProps) => {
  const navigate = useNavigate()
  const { instance } = useMsal()

  const useSelectListener: EventListenerOrEventListenerObject = (e: Event): void => {
    const detail = (e as CustomEvent).detail as FdsNavigationItem

    if (typeof detail.value !== 'string') {
      const msalMethod = detail.value as MsalMethod
      msalMethod(instance)
      return
    }

    const route = detail.value as string
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

  return (
    <>
      {selectedItem ? (
        <FdsNavigationComponent variant={variant} items={items} selected={selectedItem} />
      ) : (
        <FdsNavigationComponent variant={variant} items={items} />
      )}
    </>
  )
}

export default Navbar
