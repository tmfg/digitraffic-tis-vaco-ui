import { act, render, screen } from '@testing-library/react'
import { MsalReactTester } from 'msal-react-tester'
import { MemoryRouter } from 'react-router-dom'
import HomePage from './HomePage'
import { MsalProvider } from '@azure/msal-react'
import { describe, beforeEach, afterEach, it, expect } from 'vitest'
import i18next from 'i18next'
import { msalInitTester, resetTester } from '../../test/unit/vitestSetup'

describe('Home Page', () => {
  let msalTester: MsalReactTester

  beforeEach(() => {
    msalTester = msalInitTester()
  })

  afterEach(() => {
    resetTester(msalTester)
  })

  const renderComponent = async () => {
    await act(async () => {
      render(
        <MsalProvider instance={msalTester.client}>
          <MemoryRouter>
            <HomePage />
          </MemoryRouter>
        </MsalProvider>
      )
    })
  }

  it('Home page renders correctly when user is not logged in', async () => {
    // Mock a guest user, not yet authenticated:
    await msalTester.isNotLogged()
    await renderComponent()
    await msalTester.waitForRedirect()
    expect(screen.getByText(i18next.t('vaco:login'))).toBeInTheDocument()
    expect(screen.getByText(i18next.t('vaco:register'))).toBeInTheDocument()
    expect(screen.queryByText(i18next.t('home:shortcut:testData:label'))).toBeNull()
    expect(screen.queryByText(i18next.t('home:shortcut:myData:label'))).toBeNull()
  })

  it('Home page renders correctly when user got logged in', async () => {
    // Mock a guest user, not yet authenticated:
    await msalTester.isLogged()
    await renderComponent()
    await msalTester.waitForRedirect()
    expect(screen.getByText(i18next.t('home:shortcut:testData:label'))).toBeInTheDocument()
    expect(screen.getByText(i18next.t('home:shortcut:myData:label'))).toBeInTheDocument()
    expect(screen.queryByText(i18next.t('vaco:login'))).toBeNull()
    expect(screen.queryByText(i18next.t('vaco:register'))).toBeNull()
  })
})
