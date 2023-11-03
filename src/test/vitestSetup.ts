import '@testing-library/jest-dom'
import { beforeAll, afterEach } from 'vitest'
//import matchers from '@testing-library/jest-dom/matchers'
//expect.extend(matchers)
import { MsalReactTesterPlugin } from 'msal-react-tester'
import { vi, expect } from 'vitest'
import { ITestRunner } from 'msal-react-tester/dist/MsalReactTesterPlugin'
import { cleanup } from '@testing-library/react'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { resources } from '../i18n'

beforeAll(async () => {
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
  cleanup()
})
