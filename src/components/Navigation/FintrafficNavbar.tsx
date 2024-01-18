import { FdsNavigationItem, FdsNavigationVariant } from '../../../coreui-components/src/fds-navigation'
import { ReactComponent as FintrafficLogo } from '../../assets/svg/fintraffic_logo.svg'

import Navbar from './Navbar'
import { useTranslation } from 'react-i18next'

const FintrafficNavbar = () => {
  const { i18n, t } = useTranslation()
  const selectedLocaleCode: string = i18n.resolvedLanguage || i18n.language

  const items: FdsNavigationItem[] = [
    {
      label: t('fintraffic:traffic'),
      value: 'https://liikennetilanne.fintraffic.fi/pulssi/?lang=' + selectedLocaleCode
    },
    {
      label: t('fintraffic:feedback'),
      value: 'https://www.palautevayla.fi/aspa/en/liikenteen-asiakaspalvelu-etsi-tietoa?lang=' + selectedLocaleCode
    },
    {
      label: t('fintraffic:train'),
      value: 'https://junalahdot.fintraffic.fi/?lang=' + (selectedLocaleCode === 'sv' ? 'se' : selectedLocaleCode)
    },
    {
      label: t('fintraffic:drone'),
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
      label: t('fintraffic:nap'),
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
      <a target="_blank" rel="noopener noreferrer" href={'https://www.fintraffic.fi/' + selectedLocaleCode}>
        <div style={{ display: 'flex', alignItems: 'center', width: '100px', flexShrink: 0 }}>
          <FintrafficLogo />
        </div>
      </a>
    </Navbar>
  )
}

export default FintrafficNavbar
