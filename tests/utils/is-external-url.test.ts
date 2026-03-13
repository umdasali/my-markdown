import { describe, it, expect } from 'vitest'
import { isExternalUrl } from '../../src/utils/is-external-url'

describe('isExternalUrl', () => {
  it('treats absolute https URLs as external', () => {
    expect(isExternalUrl('https://example.com')).toBe(true)
  })

  it('treats relative paths as internal', () => {
    expect(isExternalUrl('/about')).toBe(false)
    expect(isExternalUrl('./page')).toBe(false)
    expect(isExternalUrl('../other')).toBe(false)
  })

  it('treats anchor links as internal', () => {
    expect(isExternalUrl('#section')).toBe(false)
  })

  it('treats mailto as non-external', () => {
    expect(isExternalUrl('mailto:user@example.com')).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(isExternalUrl('')).toBe(false)
  })
})
