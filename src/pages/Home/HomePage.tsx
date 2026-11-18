import { useIsAuthenticated } from '@azure/msal-react'
import { Shortcut } from '../../components/Shortcut/types'
import ShortcutPanel from '../../components/Shortcut/ShortcutPanel'
import TestDataSvg from '../../assets/svg/test_data.svg'
import DataDeliverySvg from '../../assets/svg/book_open_check.svg'
import CompaniesSvg from '../../assets/svg/building.svg'
import { useTranslation } from 'react-i18next'
import { useContext, useEffect, useState } from 'react'
import { rolesContainVacoAdmin, rolesContainVacoCompanyAdmin } from '../../util/role'
import { AppContext, AppContextType } from '../../AppContextProvider'

const HomePage = () => {
  const isAuthenticated = useIsAuthenticated()
  const { t } = useTranslation()
  const appContext: AppContextType = useContext(AppContext)
  const [hasAdminRole, setHasAdminRole] = useState<boolean | undefined>(undefined)
  const [hasCompanyAdminRole, setHasCompanyAdminRole] = useState<boolean | undefined>(undefined)

  const publicShortcuts: Shortcut[] = [
    {
      label: t('home:shortcut:dataDelivery:label'),
      to: '/data',
      icon: <DataDeliverySvg />,
      description: t('home:shortcut:dataDelivery:intro')
    },
    {
      label: t('home:shortcut:testData:label'),
      to: '/data/request',
      icon: <TestDataSvg />,
      description: t('home:shortcut:testData:intro')
    },
    {
      label: t('home:shortcut:testResults:label'),
      to: '/data/results',
      icon: <DataDeliverySvg />,
      description: t('home:shortcut:testResults:intro')
    }
  ]

  const adminShortcuts: Shortcut[] = [
    {
      label: t('home:shortcut:companies:label'),
      to: '/admin/companies',
      icon: <CompaniesSvg />,
      description: t('home:shortcut:companies:intro')
    }
  ]

  useEffect(() => {
    if (appContext?.roles) {
      setHasAdminRole(rolesContainVacoAdmin(appContext.roles))
      setHasCompanyAdminRole(rolesContainVacoCompanyAdmin(appContext.roles))
    }
  }, [appContext])

  return (
    <div className={'page-content'}>
      <h1>{t('home:header')}</h1>

      <div className={'page-intro'}>
        <p>{t('home:intro.p1')}</p>
        <p>{t('home:intro.p2')}</p>
        <p>{t('home:intro.p3')}</p>
      </div>

      <h2>{t('home:shortcuts')}</h2>
      <ShortcutPanel items={publicShortcuts} />
      {isAuthenticated && (hasAdminRole || hasCompanyAdminRole) && <ShortcutPanel items={adminShortcuts} />}
    </div>
  )
}

export default HomePage
