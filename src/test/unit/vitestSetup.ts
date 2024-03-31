import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll } from 'vitest'
//import matchers from '@testing-library/jest-dom/matchers'
//expect.extend(matchers)
import { MsalReactTester, MsalReactTesterPlugin } from 'msal-react-tester'
import { vi, expect } from 'vitest'
import { ITestRunner } from 'msal-react-tester/dist/MsalReactTesterPlugin'
import { cleanup } from '@testing-library/react'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { resources } from '../../i18n'
import { server } from './mocks/server'
import { initializeHttpClient } from '../../HttpClient'
import { Bootstrap, Environment } from '../../types/Bootstrap'

beforeAll(async () => {
  initializeHttpClient({
    environment: Environment.Local,
    baseUrl: 'http://localhost:8080',
    tenantId: 'd8536c71-f91f-4e54-b68c-215a7fd9510b',
    clientId: '57c1b8a0-f33e-4e47-840d-8c180d933c41',
    buildInfo: 'vitest (local)'
  })
  server.listen({ onUnhandledRequest: 'error' })

  await i18n.use(initReactI18next).init({
    lng: 'fi',
    resources: resources
  })

  MsalReactTesterPlugin.init({
    spyOn: vi.spyOn,
    expect: expect,
    resetAllMocks: vi.resetAllMocks,
    waitingFor: () => {}
  } as ITestRunner)
})

afterEach(() => {
  server.resetHandlers()
  cleanup()
})

afterAll(() => server.close())

export const msalInitTester = () => {
  const msalTester = new MsalReactTester()
  msalTester.spyMsal()
  return msalTester
}

export const resetTester = (msalTester: MsalReactTester) => {
  msalTester.resetSpyMsal()
}

export const bootstrapParams: Bootstrap = {
  environment: Environment.Local,
  baseUrl: 'http://localhost:8080',
  tenantId: '',
  clientId: '57c1b8a0-f33e-4e47-840d-8c180d933c41',
  buildInfo: 'vitest (local)'
}
