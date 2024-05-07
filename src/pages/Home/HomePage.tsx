import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import { createAccount, login } from '../../hooks/auth'
import { Shortcut } from '../../components/Shortcut/types'
import ShortcutPanel from '../../components/Shortcut/ShortcutPanel'
import { ReactComponent as LoginSvg } from '../../assets/svg/login.svg'
import { ReactComponent as NewUserSvg } from '../../assets/svg/new_user.svg'
import { ReactComponent as MyDataSvg } from '../../assets/svg/my_data.svg'
import { ReactComponent as TestDataSvg } from '../../assets/svg/test_data.svg'
import { ReactComponent as DataDeliverySvg } from '../../assets/svg/book_open_check.svg'
import { ReactComponent as CompaniesSvg } from '../../assets/svg/building.svg'
import { useTranslation } from 'react-i18next'
import { useContext, useEffect, useState } from 'react'
import { rolesContainVacoAdmin, rolesContainVacoCompanyAdmin } from '../../util/role'
import { AppContext, AppContextType } from '../../AppContextProvider'

const HomePage = () => {
  const isAuthenticated = useIsAuthenticated()
  const { instance } = useMsal()
  const { t } = useTranslation()
  const appContext: AppContextType = useContext(AppContext)
  const [hasAdminRole, setHasAdminRole] = useState<boolean | undefined>(undefined)
  const [hasCompanyAdminRole, setHasCompanyAdminRole] = useState<boolean | undefined>(undefined)

  const landingShortcuts: Shortcut[] = [
    {
      label: t('vaco:login'),
      icon: <LoginSvg />,
      to: '/',
      onClick: () => {
        login(instance).catch((error) => {
          console.error('Login error', error)
        })
      },
      description: t('home:shortcut:login:intro')
    },
    {
      label: t('vaco:register'),
      icon: <NewUserSvg />,
      to: '/',
      onClick: () => {
        createAccount(instance)
      },
      description: t('home:shortcut:register:intro')
    }
  ]

  const userShortcuts: Shortcut[] = [
    {
      label: t('home:shortcut:myData:label'),
      to: '/data',
      icon: <MyDataSvg />,
      description: t('home:shortcut:myData:intro')
    },
    {
      label: t('home:shortcut:testData:label'),
      to: '/data/request',
      icon: <TestDataSvg />,
      description: t('home:shortcut:testData:intro')
    }
  ]

  const adminShortcuts: Shortcut[] = [
    {
      label: t('home:shortcut:dataDelivery:label'),
      to: '/admin/data-delivery',
      icon: <DataDeliverySvg />,
      description: t('home:shortcut:dataDelivery:intro')
    } ,
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
      <ShortcutPanel items={isAuthenticated ? userShortcuts : landingShortcuts} />
      {isAuthenticated && (hasAdminRole || hasCompanyAdminRole) && <ShortcutPanel items={adminShortcuts} />}
    </div>
  )
}

export default HomePage
