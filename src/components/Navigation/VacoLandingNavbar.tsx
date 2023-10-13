import { FdsNavigationItemPosition, FdsNavigationVariant } from '../../../coreui-components/src/fds-navigation'
import Navbar from './Navbar'
import { FdsNavigationItem } from '../../../coreui-components/src/fds-navigation'
import { createAccount, login } from '../../hooks/auth'

export const vacoStaticNavbarItems: FdsNavigationItem[] = [
  {
    label: 'VACO',
    value: '/'
  },
  {
    label: 'About',
    value: '/'
  },
  {
    label: 'Support',
    value: '/'
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
  return <Navbar variant={FdsNavigationVariant.secondary} items={vacoStaticNavbarItems} barIndex={1} />
}

export default VacoLandingNavbar
