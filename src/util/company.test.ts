import { describe, expect, it } from 'vitest'
import { isValidBusinessId } from './company'

describe('isValidBusinessId', () => {
  it('accepts seven digits, a dash and a check digit', () => {
    expect(isValidBusinessId('2499374-8')).toBe(true)
  })

  it.each(['', '24993748', '249937-48', '2499374-', '2499374-88', ' 2499374-8', 'abcdefg-8'])('rejects %j', (value) => {
    expect(isValidBusinessId(value)).toBe(false)
  })
})
