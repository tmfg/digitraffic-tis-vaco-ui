import { FdsNavigationItem, FdsNavigationVariant } from '../../../coreui-components/src/fds-navigation'
import { ReactComponent as FintrafficLogo } from '../../assets/svg/fintraffic_logo.svg'

import Navbar from './Navbar'

const FintrafficNavbar = () => {
  // TODO: add locale to links, wherever possible, once we have language selection functionality working
  const items: FdsNavigationItem[] = [
    {
      label: 'Traffic Situation',
      value: 'https://liikennetilanne.fintraffic.fi/pulssi/'
    },
    {
      label: 'Feedback Channel',
      value: 'https://www.palautevayla.fi/aspa/en/liikenteen-asiakaspalvelu-etsi-tietoa'
    },
    {
      label: 'Train Departures',
      value: 'https://junalahdot.fintraffic.fi/'
    },
    {
      label: 'Drone Services',
      value: 'https://skynavx.fi/#/drone'
    },
    {
      label: 'Digitraffic',
      value: 'https://www.digitraffic.fi/'
    },
    {
      label: 'Digitransit',
      value: 'https://digitransit.fi/'
    },
    {
      label: 'NAP',
      value: 'https://finap.fi/#/'
    },
    {
      label: 'VACO',
      value: '/'
    }
  ]
  return (
    <Navbar
      variant={FdsNavigationVariant.primary}
      items={items}
      barIndex={0}
      selectedItem={items[items.length - 1]}
      isSelectedItemStatic={true}
    >
      <a href={'https://www.fintraffic.fi/'}>
        <div style={{ display: 'flex', alignItems: 'center', width: '100px', flexShrink: 0 }}>
          <FintrafficLogo />
        </div>
      </a>
    </Navbar>
  )
}

export default FintrafficNavbar
