import { describe, expect, it } from 'vitest'
import { isValidBusinessId } from './company'

describe('isValidBusinessId', () => {
  it('accepts a business id with a valid check digit', () => {
    expect(isValidBusinessId('2499374-8')).toBe(true)
  })

  it('accepts a check digit of zero', () => {
    expect(isValidBusinessId('0000000-0')).toBe(true)
  })

  it.each(['', '24993748', '249937-48', '2499374-', '2499374-88', ' 2499374-8', 'abcdefg-8', '2499374-9'])('rejects %j', (value) => {
    expect(isValidBusinessId(value)).toBe(false)
  })
})
