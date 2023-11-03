import { act, render, screen } from '@testing-library/react'
import { MsalReactTester } from 'msal-react-tester'
import { MemoryRouter } from 'react-router-dom'
import HomePage from './HomePage'
import { MsalProvider } from '@azure/msal-react'
import { describe, beforeEach, afterEach, it, expect } from 'vitest'
import i18next from 'i18next'

describe('Home Page', () => {
  let msalTester: MsalReactTester

  beforeEach(() => {
    msalTester = new MsalReactTester()
    msalTester.spyMsal()
  })

  afterEach(() => {
    msalTester.resetSpyMsal()
  })

  it('Home page renders correctly when user is not logged in', async () => {
    // Mock a guest user, not yet authenticated:
    await msalTester.isNotLogged()

    await act(async () => {
      render(
        <MsalProvider instance={msalTester.client}>
          <MemoryRouter>
            <HomePage />
          </MemoryRouter>
        </MsalProvider>
      )
    })

    await msalTester.waitForRedirect()
    expect(screen.getByText(i18next.t('ad:login'))).toBeInTheDocument()
    expect(screen.getByText(i18next.t('ad:create'))).toBeInTheDocument()
    expect(screen.queryByText(i18next.t('vaco:testData'))).toBeNull()
    expect(screen.queryByText(i18next.t('vaco:myData'))).toBeNull()
  })

  it('Home page renders correctly when user got logged in', async () => {
    // Mock a guest user, not yet authenticated:
    await msalTester.isLogged()

    await act(async () => {
      render(
        <MsalProvider instance={msalTester.client}>
          <MemoryRouter>
            <HomePage />
          </MemoryRouter>
        </MsalProvider>
      )
    })

    await msalTester.waitForRedirect()
    expect(screen.getByText(i18next.t('vaco:testData'))).toBeInTheDocument()
    expect(screen.getByText(i18next.t('vaco:testData'))).toBeInTheDocument()
    expect(screen.queryByText(i18next.t('ad:login'))).toBeNull()
    expect(screen.queryByText(i18next.t('ad:create'))).toBeNull()
  })
})
