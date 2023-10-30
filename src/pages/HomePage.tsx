import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import { createAccount, login, logout } from '../hooks/auth'
import { Shortcut } from '../components/Shortcut/types'
import ShortcutPanel from '../components/Shortcut/ShortcutPanel'
import { ReactComponent as LoginSvg } from '../assets/svg/login.svg'
import { ReactComponent as NewUserSvg } from '../assets/svg/new_user.svg'
import { ReactComponent as MyDataSvg } from '../assets/svg/my_data.svg'
import { ReactComponent as TestDataSvg } from '../assets/svg/test_data.svg'
import { ReactComponent as TrainSvg } from '../assets/svg/train.svg'
import { useTranslation } from 'react-i18next'

const HomePage = () => {
  const { instance } = useMsal()
  const isAuthenticated = useIsAuthenticated()
  const { t } = useTranslation()

  const landingShortcuts: Shortcut[] = [
    {
      label: t('ad:login'),
      icon: <LoginSvg />,
      to: '/',
      onClick: () => {
        login(instance)
      },
      description: t('home:shortcut:login:intro')
    },
    {
      label: t('ad:create'),
      icon: <NewUserSvg />,
      to: '/',
      onClick: () => {
        createAccount(instance)
      },
      description: t('home:shortcut:create:intro')
    }
  ]

  const userShortcuts: Shortcut[] = [
    {
      label: t('vaco:myData'),
      to: '/ticket/info',
      icon: <MyDataSvg />,
      description: t('home:shortcut:myData:intro')
    },
    {
      label: t('vaco:testData'),
      to: '/ticket/request',
      icon: <TestDataSvg />,
      description: t('home:shortcut:testData:intro')
    },
    {
      label: t('ad:logout'),
      icon: <TrainSvg />,
      to: '/',
      onClick: () => {
        logout(instance)
      },
      description: 'This is temporarily here till admin panel appears'
    }
  ]

  return (
    <div className={'page-content '}>
      <h1>{t('home:header')}</h1>

      <div style={{ paddingTop: '2.5em', paddingBottom: '4em', width: '100%' }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum.
      </div>

      <h1>{t('home:shortcuts')}</h1>
      <ShortcutPanel items={isAuthenticated ? userShortcuts : landingShortcuts} />
    </div>
  )
}

export default HomePage
