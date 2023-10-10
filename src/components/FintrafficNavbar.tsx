import { FdsNavigationItem, FdsNavigationVariant } from '@fintraffic-design/coreui-components/src/fds-navigation'

import Navbar from './Navbar'

const FintrafficNavbar = () => {
  const items: FdsNavigationItem[] = [
    {
      label: 'Fintaffic',
      value: 'https://www.fintraffic.fi/fi'
    },
    {
      label: 'Something else',
      value: 'https://liikennetilanne.fintraffic.fi/pulssi/'
    },
    {
      label: 'VACO',
      value: '/'
    }
  ]
  return <Navbar variant={FdsNavigationVariant.primary} items={items} barIndex={0} />
}

export default FintrafficNavbar
