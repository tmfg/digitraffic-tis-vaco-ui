import { FdsNavigationVariant } from '../../../../coreui-components/src/fds-navigation'
import Navbar from '../Navbar'
import { FdsNavigationItem } from '../../../../coreui-components/src/fds-navigation'
import { aboutItem, getSelectedLocaleItem, loginItem, myServicesItem, supportItem, vacoItem } from './navbarItems'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import EnvironmentBar from '../../EnvironmentBar/EnvironmentBar'

const VacoLandingNavbar = () => {
  const { i18n, t } = useTranslation()
  const selectedLocaleCode = i18n.resolvedLanguage || i18n.language

  // A 't' function translates to the language of the render that created it,
  // so the items are built again from the current 't' when the language changes.
  const navbarItems: FdsNavigationItem[] = useMemo(
    () => [
      vacoItem(),
      aboutItem(t),
      supportItem(t),
      myServicesItem(t),
      loginItem(t),
      getSelectedLocaleItem(selectedLocaleCode, t)
    ],
    [t, selectedLocaleCode]
  )

  return (
    <>
      <Navbar
        variant={FdsNavigationVariant.secondary}
        items={navbarItems}
        barIndex={1}
        selectedItem={navbarItems[0]}
        isSelectedItemStatic={false}
      />
      <EnvironmentBar />
    </>
  )
}

export default VacoLandingNavbar
