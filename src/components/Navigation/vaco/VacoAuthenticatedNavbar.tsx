import { FdsNavigationVariant } from '../../../../coreui-components/src/fds-navigation'
import Navbar from '../Navbar'
import { FdsNavigationItem } from '../../../../coreui-components/src/fds-navigation'
import { useMsal } from '@azure/msal-react'
import { useContext, useMemo } from 'react'
import { logout } from '../../../hooks/auth'
import {
  aboutItem,
  getSelectedLocaleItem,
  myServicesItem,
  adminToolsItem,
  supportItem,
  userItem,
  vacoItem
} from './navbarItems'
import { useTranslation } from 'react-i18next'
import { AppContext, AppContextType } from '../../../AppContextProvider'
import { rolesContainVacoAdmin, rolesContainVacoCompanyAdmin } from '../../../util/role'
import EnvironmentBar from '../../EnvironmentBar/EnvironmentBar'

const VacoAuthenticatedNavbar = () => {
  const { instance } = useMsal()
  const { i18n, t } = useTranslation()
  const appContext: AppContextType = useContext(AppContext)
  const selectedLocaleCode = i18n.resolvedLanguage || i18n.language
  const roles = appContext?.roles
  const hasAdminRole = roles ? rolesContainVacoAdmin(roles) : false
  const hasCompanyAdminRole = roles ? rolesContainVacoCompanyAdmin(roles) : false

  // A 't' function translates to the language of the render that created it,
  // so the items are built again from the current 't' when the language changes.
  const navbarItems: FdsNavigationItem[] = useMemo(() => {
    const items: FdsNavigationItem[] = [vacoItem(), aboutItem(t), supportItem(t), myServicesItem(t)]
    if (hasAdminRole || hasCompanyAdminRole) {
      items.push(adminToolsItem(t))
    }
    const account = instance.getActiveAccount()
    if (account) {
      const user: FdsNavigationItem = userItem(t)
      user.label = account.name as string
      user.dropDownItems?.push({
        label: t('vaco:logout'),
        value: () => {
          logout(instance)
        }
      })
      items.push(user)
    }
    items.push(getSelectedLocaleItem(selectedLocaleCode, t))
    return items
  }, [hasAdminRole, hasCompanyAdminRole, instance, t, selectedLocaleCode])

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

export default VacoAuthenticatedNavbar
