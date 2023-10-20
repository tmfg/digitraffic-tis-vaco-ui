import { FdsNavigationItemPosition, FdsNavigationVariant } from '../../../coreui-components/src/fds-navigation'
import Navbar from './Navbar'
import { FdsNavigationItem } from '../../../coreui-components/src/fds-navigation'
import { createAccount, login } from '../../hooks/auth'

export const vacoStaticNavbarItems: FdsNavigationItem[] = [
  {
    label: 'VACO',
    value: '/',
    bold: true
  },
  {
    label: 'About',
    value: '/about'
  },
  {
    label: 'Support',
    value: '/support'
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
    position: FdsNavigationItemPosition.right
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
