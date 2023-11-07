import { unsafeCSS } from 'lit'

/* istanbul ignore next 7 -- @preserve */
export const tokenVar = token => {
  if (token == null || token.name == null || token.value == null) {
    console.error('invalid FdsToken', token)
    return unsafeCSS('')
  }
  return unsafeCSS(['var(--', token.name, ', ', token.value, ')'].join(''))
}
