import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MsalReactTester } from 'msal-react-tester'
import { MsalProvider } from '@azure/msal-react'
import { http, HttpResponse } from 'msw'
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest'
import PackageButton from './PackageButton'
import { bootstrapParams, msalInitTester, resetTester } from '../../test/unit/vitestSetup'
import { server } from '../../test/unit/mocks/server'
import { initializeBootstrap } from '../../hooks/auth'
import { PackageResource } from '../../types/Package'

const downloadFileMock = vi.hoisted(() => vi.fn())
vi.mock('../../util/download', () => ({ downloadFile: downloadFileMock }))
vi.mock(
  '../fds/FdsButtonComponent',
  async () => (await import('../../test/unit/mocks/fdsComponents')).fdsComponentMocks.button
)

describe('PackageButton', () => {
  let msalTester: MsalReactTester
  let authorizationHeaders: (string | null)[]

  const entryPackage = {
    data: { name: 'result' },
    links: { refs: { self: { href: 'http://localhost:8080/api/ui/packages/pkg-1', method: 'GET' } } }
  } as unknown as PackageResource

  beforeEach(() => {
    initializeBootstrap(bootstrapParams)
    msalTester = msalInitTester()
    authorizationHeaders = []
    downloadFileMock.mockClear()
    server.use(
      http.get('http://localhost:8080/api/ui/packages/pkg-1', ({ request }) => {
        authorizationHeaders.push(request.headers.get('Authorization'))
        return new HttpResponse('zipdata', { status: 200, headers: { 'Content-Type': 'application/zip' } })
      })
    )
  })

  afterEach(() => {
    resetTester(msalTester)
  })

  it('downloads without a token when user is not logged in', async () => {
    await msalTester.isNotLogged()
    await act(async () => {
      render(
        <MsalProvider instance={msalTester.client}>
          <PackageButton entryPackage={entryPackage} />
        </MsalProvider>
      )
    })
    await msalTester.waitForRedirect()

    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => expect(authorizationHeaders).toHaveLength(1))
    expect(authorizationHeaders[0]).toBeNull()
    await waitFor(() => expect(downloadFileMock).toHaveBeenCalled())
  })
})
