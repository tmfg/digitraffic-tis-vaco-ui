import {
  FdsNavigationItemPosition,
  FdsNavigationVariant
} from '../../coreui-components/src/fds-navigation'
import Navbar from './Navbar'
import { FdsNavigationItem } from '../../coreui-components/src/fds-navigation'
import { useMsal } from '@azure/msal-react'
import { useEffect, useState } from 'react'

export const vacoStaticNavbarItems: FdsNavigationItem[] = [
  {
    label: 'VACO',
    value: '/'
  },
  {
    label: 'Dashboard',
    value: '/dashboard'
  },
  {
    label: 'Create ticket',
    value: '/ticket/request'
  },
  {
    label: 'View ticket',
    value: '/ticket/info'
  }
]

const userNavbarItem = {
  label: '',
  value: '',
  position: FdsNavigationItemPosition.right
}

const languageNavbarItem = {
  label: 'In English',
  value: '',
  position: FdsNavigationItemPosition.right
}

const VacoNavbar = () => {
  const { instance } = useMsal()
  const [userName, setUserName] = useState<string | undefined>(undefined)
  const vacoNavbarItems = [...vacoStaticNavbarItems]

  useEffect(() => {
    const account = instance.getActiveAccount()
    if (account && !userName) {
      setUserName(account.name)
    }
  }, [instance])

  useEffect(() => {
    // Later: getting the language selection from local storage or wherever
    // Once everything is ready, time to add all "dynamic" navbar items
    if (userName) {
      userNavbarItem.label = userName
      vacoNavbarItems.push(userNavbarItem)
      vacoNavbarItems.push(languageNavbarItem)
    }
  }, [userName])

  return (
    <Navbar
      variant={FdsNavigationVariant.secondary}
      items={userName ? vacoNavbarItems : vacoStaticNavbarItems}
      barIndex={1}
    />
  )
}

export default VacoNavbar
