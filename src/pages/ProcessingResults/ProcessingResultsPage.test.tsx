import { act, render, screen } from '@testing-library/react'
import { MsalReactTester } from 'msal-react-tester'
import { MemoryRouter } from 'react-router-dom'
import { MsalProvider } from '@azure/msal-react'
import { describe, beforeEach, afterEach, it, expect } from 'vitest'
import i18next from 'i18next'
import ProcessingResultsPage from './ProcessingResultsPage'

describe('Processing Results Page', () => {
  let msalTester: MsalReactTester

  beforeEach(() => {
    msalTester = new MsalReactTester()
    msalTester.spyMsal()
  })

  afterEach(() => {
    msalTester.resetSpyMsal()
  })

  it('Processing Results page renders correctly when user is not logged in', async () => {
    // Mock a guest user, not yet authenticated:
    await msalTester.isNotLogged()

    await act(async () => {
      render(
        <MsalProvider instance={msalTester.client}>
          <MemoryRouter>
            <ProcessingResultsPage />
          </MemoryRouter>
        </MsalProvider>
      )
    })

    await msalTester.waitForRedirect()
    expect(screen.getByText(i18next.t('error:authRequired'))).toBeInTheDocument()
    expect(screen.queryByText(i18next.t('services:myData:results:header'))).toBeNull()
  })

  it('Processing Results page renders correctly when user got logged in', async () => {
    // Mock a guest user, not yet authenticated:
    await msalTester.isLogged()

    await act(async () => {
      render(
        <MsalProvider instance={msalTester.client}>
          <MemoryRouter>
            <ProcessingResultsPage />
          </MemoryRouter>
        </MsalProvider>
      )
    })

    await msalTester.waitForRedirect()
    expect(screen.getByText(i18next.t('services:myData:results:header'))).toBeInTheDocument()
    expect(screen.queryByText(i18next.t('error:authRequired'))).toBeNull()
  })
})
