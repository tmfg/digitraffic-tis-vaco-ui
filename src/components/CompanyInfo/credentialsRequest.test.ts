import { describe, expect, it } from 'vitest'
import { buildCredentialsRequest } from './credentialsRequest.ts'

describe('buildCredentialsRequest', () => {
  const formData = {
    name: 'My credentials',
    description: 'For testing',
    type: 'HTTP Basic',
    details_userId: 'user',
    details_password: 'secret',
    urlPattern: 'https://example.com/*'
  }

  it('puts the type inside details with the value of the form type', () => {
    const request = buildCredentialsRequest(formData, '1234567-8')

    expect(request.details).toEqual({ type: 'HTTP Basic', userId: 'user', password: 'secret' })
  })

  it('keeps the top-level fields', () => {
    const request = buildCredentialsRequest(formData, '1234567-8')

    expect(request).toMatchObject({
      name: 'My credentials',
      description: 'For testing',
      type: 'HTTP Basic',
      owner: '1234567-8',
      urlPattern: 'https://example.com/*'
    })
  })
})
