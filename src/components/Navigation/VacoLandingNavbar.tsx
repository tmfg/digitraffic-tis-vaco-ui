import { FdsNavigationItemPosition, FdsNavigationVariant } from '../../../coreui-components/src/fds-navigation'
import Navbar from './Navbar'
import { FdsNavigationItem } from '../../../coreui-components/src/fds-navigation'
import { createAccount, login } from '../../hooks/auth'
import { FdsIconType } from '../../../coreui-components/src/fds-icon'

export const vacoStaticNavbarItems: FdsNavigationItem[] = [
  {
    label: 'VACO',
    value: '/',
    bold: true
  },
  {
    label: 'About',
    value: '',
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
    value: '',
    dropDownItems: [
      {
        label: 'Support channels',
        value: 'https://www.fintraffic.fi/en/instructions-tos',
        icon: 'external-link' as FdsIconType
      }
    ]
  },
  {
    label: 'Login',
    value: login,
    position: FdsNavigationItemPosition.right
  },
  {
    label: 'Register',
    value: createAccount,
    position: FdsNavigationItemPosition.right
  },
  {
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
]

const VacoLandingNavbar = () => {
  return (
    <Navbar
      variant={FdsNavigationVariant.secondary}
      items={vacoStaticNavbarItems}
      barIndex={1}
      selectedItem={vacoStaticNavbarItems[0]}
      isSelectedItemStatic={false}
    />
  )
}

export default VacoLandingNavbar
