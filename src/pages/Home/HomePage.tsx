import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import { createAccount, login } from '../../hooks/auth'
import { Shortcut } from '../../components/Shortcut/types'
import ShortcutPanel from '../../components/Shortcut/ShortcutPanel'
import { ReactComponent as LoginSvg } from '../../assets/svg/login.svg'
import { ReactComponent as NewUserSvg } from '../../assets/svg/new_user.svg'
import { ReactComponent as MyDataSvg } from '../../assets/svg/my_data.svg'
import { ReactComponent as TestDataSvg } from '../../assets/svg/test_data.svg'
import { useTranslation } from 'react-i18next'

const HomePage = () => {
  const { instance } = useMsal()
  const isAuthenticated = useIsAuthenticated()
  const { t } = useTranslation()

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

  return (
    <div className={'page-content '}>
      <h1>{t('home:header')}</h1>

      <div className={'page-intro'}>
        <p>{t('home:intro:p1')}</p>
        <p>{t('home:intro:p2')}</p>
        <p>{t('home:intro:p3')}</p>
      </div>

      <h2>{t('home:shortcuts')}</h2>
      <ShortcutPanel items={isAuthenticated ? userShortcuts : landingShortcuts} />
    </div>
  )
}

export default HomePage
