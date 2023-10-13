import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import { createAccount, login, logout } from '../hooks/auth'
import { Shortcut } from '../components/Shortcut/types'

const HomePage = () => {
  const { instance } = useMsal()
  const isAuthenticated = useIsAuthenticated()

  const landingShortcuts: Shortcut[] = [
    {
      label: 'Login',
      onClick: () => {
        login(instance)
      }
    },
    {
      label: 'Create account',
      onClick: () => {
        createAccount(instance)
      }
    }
  ]

  const userShortcuts: Shortcut[] = [
    {
      label: 'My data',
      to: '/ticket/info'
    },
    {
      label: 'Test data'
    },
    {
      label: 'Log out',
      onClick: () => {
        logout(instance)
      }
    }
  ]

  return (
    <div className={'sub-page '}>
      <h3>VACO - validation & conversion</h3>

      <div style={{ paddingTop: '2em', paddingBottom: '2em', width: '50em' }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum.
      </div>

      <h3>Shortcuts</h3>
      <div>
        {(isAuthenticated ? userShortcuts : landingShortcuts).map((item) => (
          <button key={item.label} onClick={item.onClick}>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default HomePage
