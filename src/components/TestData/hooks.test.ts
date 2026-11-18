import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, beforeEach, it, expect } from 'vitest'
import { bootstrapParams } from '../../test/unit/vitestSetup'
import { server } from '../../test/unit/mocks/server'
import { initializeBootstrap } from '../../hooks/auth'
import { useCompanyRulesFetch } from './hooks'

const rule = (format: string) => ({
  data: { type: 'VALIDATION_SYNTAX', format, identifyingName: format + '-rule' }
})

describe('useCompanyRulesFetch', () => {
  let release: Record<string, () => void>

  beforeEach(() => {
    initializeBootstrap(bootstrapParams)
    release = {}
    server.use(
      http.get('http://localhost:8080/api/ui/rules', async ({ request }) => {
        const businessId = new URL(request.url).searchParams.get('businessId') as string
        await new Promise<void>((resolve) => {
          release[businessId] = resolve
        })
        return HttpResponse.json([rule(businessId === 'old-company' ? 'gtfs' : 'netex')], { status: 200 })
      })
    )
  })

  it('keeps the rules of the selected company when the response of the previous company arrives last', async () => {
    const { result, rerender } = renderHook(({ id }) => useCompanyRulesFetch(id, 'token', true), {
      initialProps: { id: 'old-company' }
    })
    await waitFor(() => expect(release['old-company']).toBeDefined())
    rerender({ id: 'new-company' })
    await waitFor(() => expect(release['new-company']).toBeDefined())

    release['new-company']()
    await waitFor(() => expect(result.current[0]).toEqual(['netex']))
    release['old-company']()
    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(result.current[0]).toEqual(['netex'])
    expect(result.current[1]).toHaveLength(1)
  })

  it('clears the rules of the previous company while the rules of the new company load', async () => {
    const { result, rerender } = renderHook(({ id }) => useCompanyRulesFetch(id, 'token', true), {
      initialProps: { id: 'old-company' }
    })
    await waitFor(() => expect(release['old-company']).toBeDefined())
    release['old-company']()
    await waitFor(() => expect(result.current[0]).toEqual(['gtfs']))

    rerender({ id: 'new-company' })

    await waitFor(() => expect(release['new-company']).toBeDefined())
    expect(result.current[0]).toEqual([])
    expect(result.current[1]).toEqual([])
    expect(result.current[4]).not.toBe('new-company')
    release['new-company']()
    await waitFor(() => expect(result.current[4]).toBe('new-company'))
  })
})
