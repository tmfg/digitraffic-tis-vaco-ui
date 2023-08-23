import {
  FdsNavigationItemPosition,
  FdsNavigationVariant
} from '@fintraffic-design/coreui-components/src/fds-navigation'
import Navbar from './Navbar'
import { FdsNavigationItem } from '@fintraffic-design/coreui-components/src/fds-navigation'

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
  return <Navbar variant={FdsNavigationVariant.secondary} items={vacoNavbarItems} barIndex={1} />
}

export default VacoNavbar
