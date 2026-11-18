import { describe, beforeEach, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { IPublicClientApplication, InteractionStatus } from '@azure/msal-browser'
import i18next from 'i18next'
import { submitData } from './helpers'
import { RulesetResource, RulesetType } from '../../types/Ruleset'
import { PublicValidationTest } from '../../types/PublicValidationTest'
import { bootstrapParams } from '../../test/unit/vitestSetup'
import { server } from '../../test/unit/mocks/server'
import { initializeBootstrap } from '../../hooks/auth'

const rule: RulesetResource = {
  data: {
    identifyingName: 'gtfs.canonical',
    description: '',
    category: 'GENERIC',
    type: RulesetType.ValidationSyntax,
    format: 'gtfs',
    dependencies: []
  }
}

describe('Test data submission', () => {
  let postedBusinessIds: unknown[]

  beforeEach(() => {
    initializeBootstrap(bootstrapParams)
    postedBusinessIds = []
    server.use(
      http.post('http://localhost:8080/api/ui/queue', async ({ request }) => {
        postedBusinessIds.push(((await request.json()) as { businessId: string }).businessId)
        return HttpResponse.json({ data: { publicId: 'p1' } }, { status: 200 })
      })
    )
  })

  const submit = async (businessId: string) => {
    const instance = { getActiveAccount: () => null } as unknown as IPublicClientApplication
    await submitData(
      instance,
      InteractionStatus.None,
      { url: 'https://example.com/feed.zip', format: 'gtfs', businessId, 'rule-gtfs.canonical': true },
      () => {},
      () => {},
      () => {},
      i18next.t,
      [rule]
    )
  }

  it('sends the business id of the selected company', async () => {
    await submit('1111111-1')

    expect(postedBusinessIds).toEqual(['1111111-1'])
  })

  it('sends the public test company when that is the business id of the form', async () => {
    await submit(PublicValidationTest.businessId)

    expect(postedBusinessIds).toEqual([PublicValidationTest.businessId])
  })
})
