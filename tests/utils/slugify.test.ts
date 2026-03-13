import { describe, it, expect } from 'vitest'
import { slugify } from '../../src/utils/slugify'

describe('slugify', () => {
  it('lowercases and replaces spaces with hyphens', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('removes special characters', () => {
    expect(slugify('Hello, World!')).toBe('hello-world')
  })

  it('collapses multiple hyphens', () => {
    expect(slugify('Hello   World')).toBe('hello-world')
  })

  it('trims leading and trailing hyphens', () => {
    expect(slugify(' Hello ')).toBe('hello')
  })

  it('handles empty string', () => {
    expect(slugify('')).toBe('')
  })

  it('handles numbers', () => {
    expect(slugify('Section 1.2.3')).toBe('section-123')
  })
})
