import {
  FdsNavigationItemPosition,
  FdsNavigationVariant
} from '@fintraffic-design/coreui-components/src/fds-navigation'
import Navbar from './Navbar'
import { FdsNavigationItem } from '@fintraffic-design/coreui-components/src/fds-navigation'
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { instance } = useMsal()
  const [userName, setUserName] = useState<string | undefined>(undefined)
  const vacoNavbarItems = [...vacoStaticNavbarItems]

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const account = instance.getActiveAccount()
    if (account && !userName) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
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
