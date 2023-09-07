import {
  FdsNavigationItemPosition,
  FdsNavigationVariant
} from '@fintraffic-design/coreui-components/src/fds-navigation'
import Navbar from './Navbar'
import { FdsNavigationItem } from '@fintraffic-design/coreui-components/src/fds-navigation'
import { useMsal } from '@azure/msal-react'
import { useEffect, useState } from 'react'

export const vacoNavbarItems: FdsNavigationItem[] = [
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
  },
  {
    label: 'Name Surname',
    value: '',
    position: FdsNavigationItemPosition.right
  },
  {
    label: 'In English',
    value: '',
    position: FdsNavigationItemPosition.right
  }
]

const VacoNavbar = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { instance } = useMsal()
  const [userName, setUserName] = useState<string | undefined>(undefined)

  useEffect(() => {
    // @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const account = instance.getAllAccounts()
    if (account && !userName) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
      setUserName(account.name)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
      vacoNavbarItems[4].label = account.name!
    }
  }, [userName])

  return <Navbar variant={FdsNavigationVariant.secondary} items={userName ? vacoNavbarItems : []} barIndex={1} />
}

export default VacoNavbar
