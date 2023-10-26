import { FdsNavigationItemPosition, FdsNavigationVariant } from '../../../coreui-components/src/fds-navigation'
import Navbar from './Navbar'
import { FdsNavigationItem } from '../../../coreui-components/src/fds-navigation'
import { useMsal } from '@azure/msal-react'
import { useEffect, useState } from 'react'
import { FdsIconType } from '../../../coreui-components/src/fds-icon'
import { logout } from '../../hooks/auth'

export const vacoNavbarItems: FdsNavigationItem[] = [
  {
    label: 'VACO',
    value: '/',
    bold: true
  },
  {
    label: 'About',
    value: '/about',
    dropDownItems: [
      {
        label: 'VACO instructions',
        value: 'https://www.fintraffic.fi/fi',
        icon: 'external-link' as FdsIconType
      },
      {
        label: 'Terms and conditions',
        value: 'https://www.fintraffic.fi/fi',
        icon: 'external-link' as FdsIconType
      },
      {
        label: 'Privacy policy',
        value: 'https://www.fintraffic.fi/fi',
        icon: 'external-link' as FdsIconType
      }
    ]
  },
  {
    label: 'Support',
    value: '/support',
    dropDownItems: [
      {
        label: 'Support channels',
        value: 'https://www.fintraffic.fi/en/instructions-tos',
        icon: 'external-link' as FdsIconType
      }
    ]
  },
  {
    label: 'My services',
    value: '',
    dropDownItems: [
      {
        label: 'Create ticket',
        value: '/ticket/request'
      },
      {
        label: 'View ticket',
        value: '/ticket/info'
      }
    ]
  }
]

const userNavbarItem: FdsNavigationItem = {
  label: '',
  value: '',
  position: FdsNavigationItemPosition.right,
  icon: 'user' as FdsIconType,
  dropDownItems: [
    {
      label: 'User account',
      value: '/'
    }
  ]
}

const languageNavbarItem: FdsNavigationItem = {
  label: 'In English',
  value: '',
  position: FdsNavigationItemPosition.right,
  icon: 'globe' as FdsIconType,
  dropDownItems: [
    {
      label: 'Suomeksi',
      value: 'https://www.fintraffic.fi/en/instructions-tos'
    },
    {
      label: 'På Svenska',
      value: 'https://www.fintraffic.fi/en/instructions-tos'
    },
    {
      label: 'In English',
      value: 'https://www.fintraffic.fi/en/instructions-tos'
    }
  ]
}

const VacoAuthenticatedNavbar = () => {
  const { instance } = useMsal()
  const [userName, setUserName] = useState<string | undefined>(undefined)
  const [userNavbarItems, setUserNavbarItems] = useState([...vacoNavbarItems])

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
      userNavbarItem.dropDownItems?.push({
        label: 'Log out',
        value: () => {
          logout(instance)
        }
      })
      vacoNavbarItems.push(userNavbarItem)
      vacoNavbarItems.push(languageNavbarItem)
      setUserNavbarItems([...vacoNavbarItems])
    }
  }, [userName])

  return (
    <Navbar
      variant={FdsNavigationVariant.secondary}
      items={userName ? userNavbarItems : vacoNavbarItems}
      barIndex={1}
      selectedItem={vacoNavbarItems[0]}
      isSelectedItemStatic={false}
    />
  )
}

export default VacoAuthenticatedNavbar
