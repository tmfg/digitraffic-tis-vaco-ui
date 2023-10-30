import { FdsNavigationVariant } from '../../../../coreui-components/src/fds-navigation'
import Navbar from '../Navbar'
import { FdsNavigationItem } from '../../../../coreui-components/src/fds-navigation'
import { useMsal } from '@azure/msal-react'
import { useCallback, useEffect, useState } from 'react'
import { logout } from '../../../hooks/auth'
import { aboutItem, getSelectedLocaleItem, myServicesItem, supportItem, userItem, vacoItem } from './navbarItems'
import { useTranslation } from 'react-i18next'

const VacoAuthenticatedNavbar = () => {
  const { instance } = useMsal()
  const [userNavbarItems, setUserNavbarItems] = useState<FdsNavigationItem[]>([])
  const { i18n, t } = useTranslation()

  const languageSelectionCallback = useCallback(
    (newLocaleCode: string) => {
      const vacoNavbarItems: FdsNavigationItem[] = [vacoItem(), aboutItem(t), supportItem(t), myServicesItem(t)]
      const account = instance.getActiveAccount()
      if (account) {
        const user: FdsNavigationItem = userItem(t)
        user.label = account.name as string
        user.dropDownItems?.push({
          label: 'Log out',
          value: () => {
            logout(instance)
          }
        })
        vacoNavbarItems.push(user)
      }
      vacoNavbarItems.push(getSelectedLocaleItem(newLocaleCode, t))
      setUserNavbarItems(vacoNavbarItems)
    },
    [instance, t]
  )

  useEffect(() => {
    const selectedLocaleCode = i18n.resolvedLanguage || i18n.language
    languageSelectionCallback(selectedLocaleCode)
  }, [instance, i18n, languageSelectionCallback])

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

export default VacoAuthenticatedNavbar
