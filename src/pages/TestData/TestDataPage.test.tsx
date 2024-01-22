import { act, render, screen } from '@testing-library/react'
import { MsalReactTester } from 'msal-react-tester'
import { MemoryRouter } from 'react-router-dom'
import { MsalProvider } from '@azure/msal-react'
import { describe, beforeEach, afterEach, it, expect } from 'vitest'
import i18next from 'i18next'
import TestDataPage from './TestDataPage'
import { bootstrapParams, msalInitTester, resetTester } from '../../test/unit/vitestSetup'
import CompanyContextProvider from '../../CompanyContextProvider'
import { initializeBootstrap } from '../../hooks/auth'

describe('Test Data Page', () => {
  let msalTester: MsalReactTester

  beforeEach(() => {
    msalTester = msalInitTester()
  })

  afterEach(() => {
    resetTester(msalTester)
  })

  it('Test Data Page renders correctly when user is not logged in', async () => {
    // Mock a guest user, not yet authenticated:
    await msalTester.isNotLogged()

    await act(async () => {
      render(
        <MsalProvider instance={msalTester.client}>
          <MemoryRouter>
            <TestDataPage />
          </MemoryRouter>
        </MsalProvider>
      )
    })

    await msalTester.waitForRedirect()
    expect(screen.getByText(i18next.t('error:authRequired'))).toBeInTheDocument()
    expect(screen.queryByText(i18next.t('sservices:testData:header'))).toBeNull()
  })

  it('Test data Page renders correctly when user got logged in', async () => {
    initializeBootstrap(bootstrapParams)
    // Mock a guest user, not yet authenticated:
    await msalTester.isLogged()

    await act(async () => {
      render(
        <MsalProvider instance={msalTester.client}>
          <MemoryRouter>
            <CompanyContextProvider>
              <TestDataPage />
            </CompanyContextProvider>
          </MemoryRouter>
        </MsalProvider>
      )
    })

    await msalTester.waitForRedirect()
    expect(screen.getByText(i18next.t('services:testData:header'))).toBeInTheDocument()
    expect(screen.queryByText(i18next.t('error:authRequired'))).toBeNull()
  })
})
