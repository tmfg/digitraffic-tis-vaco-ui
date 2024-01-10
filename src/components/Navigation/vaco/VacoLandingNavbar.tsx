import { FdsNavigationVariant } from '../../../../coreui-components/src/fds-navigation'
import Navbar from '../Navbar'
import { FdsNavigationItem } from '../../../../coreui-components/src/fds-navigation'
import { aboutItem, getSelectedLocaleItem, loginItem, registerItem, supportItem, vacoItem } from './navbarItems'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { fallbackLng } from '../../../i18n'

const VacoLandingNavbar = () => {
  const [userNavbarItems, setUserNavbarItems] = useState<FdsNavigationItem[]>([])
  const { i18n, t } = useTranslation()

  const languageSelectionCallback = useCallback(
    (newLocaleCode: string) => {
      // This 't' from a hook has to be used because that's the only way to have
      // these translation updated with user's actual selected language and not the default one
      const vacoNavbarItems: FdsNavigationItem[] = [
        vacoItem(),
        aboutItem(t),
        supportItem(t),
        loginItem(t),
        registerItem(t),
        getSelectedLocaleItem(newLocaleCode, t)
      ]
      setUserNavbarItems(vacoNavbarItems)
    },
    [t]
  )

  useEffect(() => {
    if (userNavbarItems.length === 0) {
      const selectedLocaleCode = i18n.resolvedLanguage || i18n.language || fallbackLng[0]
      languageSelectionCallback(selectedLocaleCode)
    }
  }, [i18n, languageSelectionCallback, userNavbarItems])

  return (
    <Navbar
      variant={FdsNavigationVariant.secondary}
      items={userNavbarItems}
      barIndex={1}
      selectedItem={userNavbarItems[0]}
      isSelectedItemStatic={false}
      languageSelectionCallback={languageSelectionCallback}
    />
  )
}

export default VacoLandingNavbar
