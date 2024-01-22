import { act, render, fireEvent } from '@testing-library/react'
import { MsalReactTester } from 'msal-react-tester'
import { MemoryRouter } from 'react-router-dom'
import { MsalProvider } from '@azure/msal-react'
import { describe, beforeEach, afterEach, it, expect } from 'vitest'
import i18next from 'i18next'
import { bootstrapParams, msalInitTester, resetTester } from '../../test/unit/vitestSetup'
import Form from './Form'
import { screen } from 'shadow-dom-testing-library'
import userEvent from '@testing-library/user-event'
import { initializeBootstrap } from '../../hooks/auth'
//import { submitData } from './formActions'

describe('Test Data Form', () => {
  let msalTester: MsalReactTester
  // let container

  beforeEach(() => {
    msalTester = msalInitTester()
  })

  afterEach(() => {
    resetTester(msalTester)
  })

  const renderComponent = async () => {
    await act(async () => {
      /* vitest.mock('../fds/FdsButtonComponent', () => ({
        FdsButtonComponent: () => (
          <button
            type={'submit'}
            onClick={(e) => {
              e.preventDefault()
              submitData(
                msalTester.client,
                {},
                () => {},
                () => {},
                () => {},
                i18next.t,
                []
              ).catch(
                (err) => console.log('Data submission error', err)
                // TODO: show some alert
              )
            }}
            //label={t('services:testData:form:submit')}
          >
            Submit
          </button>
        )
      }))*/

      /*container =*/ render(
        <MsalProvider instance={msalTester.client}>
          <MemoryRouter>
            <Form />
          </MemoryRouter>
        </MsalProvider>
      )
    })
  }

  it('Form renders correctly when user got logged in', async () => {
    initializeBootstrap(bootstrapParams)
    // Mock a guest user, not yet authenticated:
    await msalTester.isLogged()
    await renderComponent()
    await msalTester.waitForRedirect()

    expect(screen.getByText(i18next.t('services:testData:form:title'))).toBeInTheDocument()
    expect(screen.getByText(i18next.t('services:testData:form:section:basic'))).toBeInTheDocument()
    expect(screen.queryByText(i18next.t('services:testData:form:section:rules'))).toBeNull()

    const user = userEvent.setup()
    const urlInput: HTMLInputElement = screen.getAllByShadowLabelText('')[1] as HTMLInputElement
    await user.click(urlInput)
    fireEvent.change(urlInput, { target: { value: 'https://someurl.com' } })
    expect(urlInput?.value).toBe('https://someurl.com')

    const feedNameInput: HTMLInputElement = screen.getAllByShadowLabelText('')[0] as HTMLInputElement
    fireEvent.change(feedNameInput, { target: { value: 'Feed name' } })
    expect(feedNameInput?.value).toBe('Feed name')

    const etagInput: HTMLInputElement = screen.getAllByShadowLabelText('')[2] as HTMLInputElement
    fireEvent.change(etagInput, { target: { value: 'etag' } })
    expect(etagInput?.value).toBe('etag')

    const submit = screen.getAllByShadowRole('button')[1] //container.baseElement.querySelector('fds-button')
    await act(async () => {
      await userEvent.click(submit)
    })
    //expect(await screen.findByShadowTestId('error-alert')).toBeInTheDocument()
    //await waitFor(async () => expect(await screen.findByTestId('error-alert')).toBeInTheDocument())
  })
})
