import { act, render, screen } from '@testing-library/react'
import { MsalReactTester } from 'msal-react-tester'
import { MemoryRouter } from 'react-router-dom'
import { MsalProvider } from '@azure/msal-react'
import { describe, beforeEach, afterEach, it, expect } from 'vitest'
import i18next from 'i18next'
import MyDataPage from './MyDataPage'
import { bootstrapParams, msalInitTester, resetTester } from '../../test/unit/vitestSetup'
import { initializeBootstrap } from '../../hooks/auth'

describe('My Data Page', () => {
  let msalTester: MsalReactTester

  beforeEach(() => {
    msalTester = msalInitTester()
  })

  afterEach(() => {
    resetTester(msalTester)
  })

  it('My Data page renders correctly when user is not logged in', async () => {
    initializeBootstrap(bootstrapParams)
    // Mock a guest user, not yet authenticated:
    await msalTester.isNotLogged()

    await act(async () => {
      render(
        <MsalProvider instance={msalTester.client}>
          <MemoryRouter>
            <MyDataPage />
          </MemoryRouter>
        </MsalProvider>
      )
    })

    await msalTester.waitForRedirect()
    expect(screen.getByText(i18next.t('error:authRequired'))).toBeInTheDocument()
    expect(screen.queryByText(i18next.t('services:myData:header'))).toBeNull()
  })

  /*it('My Data page renders correctly when user got logged in', async () => {
    // Mock a guest user, not yet authenticated:
    await msalTester.isLogged()

    await act(async () => {
      render(
        <MsalProvider instance={msalTester.client}>
          <MemoryRouter>
            <MyDataPage />
          </MemoryRouter>
        </MsalProvider>
      )
    })

    await msalTester.waitForRedirect()
    expect(screen.getByText(i18next.t('services:myData:header'))).toBeInTheDocument()
    expect(screen.queryByText(i18next.t('error:authRequired'))).toBeNull()
    expect(screen.getByText(i18next.t('services:myData:find'))).toBeInTheDocument()
    expect(screen.getByText(i18next.t('services:myData:latest'))).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.findByText(i18next.t('services:myData:table:id'))).toBeInTheDocument()
      expect(screen.findByText(i18next.t('services:myData:table:feedName'))).toBeInTheDocument()
      expect(screen.findByText(i18next.t('services:myData:table:format'))).toBeInTheDocument()
      expect(screen.findByText(i18next.t('services:myData:table:dateCreated'))).toBeInTheDocument()
      expect(screen.findByText(i18next.t('services:myData:table:dateStarted'))).toBeInTheDocument()
      expect(screen.findByText(i18next.t('services:myData:table:dateUpdated'))).toBeInTheDocument()
      expect(screen.findByText(i18next.t('services:myData:table:dateCompleted'))).toBeInTheDocument()
      expect(screen.findByText(i18next.t('services:myData:table:status'))).toBeInTheDocument()

      expect(screen.findByText('R0_ZYAY7fXa0_P_SPKc1C')).toBeInTheDocument()
      expect(screen.findByText('211.zip')).toBeInTheDocument()
      expect(screen.findByText('GTFS')).toBeInTheDocument()
      expect(screen.findByText('Received')).toBeInTheDocument()
    })
  })*/
})
