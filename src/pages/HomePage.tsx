import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import { createAccount, login, logout } from '../hooks/auth'
import { Shortcut } from '../components/Shortcut/types'
import ShortcutPanel from '../components/Shortcut/ShortcutPanel'
import { ReactComponent as BookSvg } from '../assets/svg/book_open.svg'
import { ReactComponent as BusSvg } from '../assets/svg/bus.svg'
import { ReactComponent as TrainSvg } from '../assets/svg/train.svg'

const HomePage = () => {
  const { instance } = useMsal()
  const isAuthenticated = useIsAuthenticated()

  const landingShortcuts: Shortcut[] = [
    {
      label: 'Login',
      icon: <BookSvg />,
      to: '#',
      onClick: () => {
        login(instance)
      },
      description: 'Log in to start using the service.'
    },
    {
      label: 'Create account',
      icon: <BusSvg />,
      to: '#',
      onClick: () => {
        createAccount(instance)
      },
      description: 'Create an account if new to the service.'
    }
  ]

  const userShortcuts: Shortcut[] = [
    {
      label: 'My data',
      to: '/ui/ticket/info',
      icon: <BookSvg />,
      description: 'Review your previous data submissions.'
    },
    {
      label: 'Test data',
      to: '/ui/ticket/request',
      icon: <BusSvg />,
      description: 'Validate data, get compliance report and converted data.'
    },
    {
      label: 'Log out',
      icon: <TrainSvg />,
      to: '#',
      onClick: () => {
        logout(instance)
      },
      description: 'This is temporarily here till admin panel appears'
    }
  ]

  return (
    <div className={'page-content '}>
      <h1>VACO - validation & conversion</h1>

      <div style={{ paddingTop: '2.5em', paddingBottom: '4em', width: '100%' }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum.
      </div>

      <h1>Shortcuts</h1>
      <ShortcutPanel items={isAuthenticated ? userShortcuts : landingShortcuts} />
    </div>
  )
}

export default HomePage
