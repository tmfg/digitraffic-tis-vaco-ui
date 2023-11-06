import { act, render, screen } from '@testing-library/react'
import { MsalReactTester } from 'msal-react-tester'
import { MemoryRouter } from 'react-router-dom'
import { MsalProvider } from '@azure/msal-react'
import { describe, beforeEach, afterEach, it, expect } from 'vitest'
import i18next from 'i18next'
import TestDataPage from './TestDataPage'
import { msalInitTester, resetTester } from '../../test/vitestSetup'

describe('Processing Results Page', () => {
  let msalTester: MsalReactTester

  beforeEach(() => {
    msalTester = msalInitTester()
  })

  afterEach(() => {
    resetTester(msalTester)
  })

  it('Processing Results page renders correctly when user is not logged in', async () => {
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

  it('Processing Results page renders correctly when user got logged in', async () => {
    // Mock a guest user, not yet authenticated:
    await msalTester.isLogged()

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
    expect(screen.getByText(i18next.t('services:testData:header'))).toBeInTheDocument()
    expect(screen.queryByText(i18next.t('error:authRequired'))).toBeNull()
  })
})
