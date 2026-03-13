import { describe, it, expect } from 'vitest'
import { buildProcessor } from '../../src/core/parser'

describe('sanitize plugin', () => {
  it('strips <script> tags by default', async () => {
    const { processor } = await buildProcessor({ sanitize: true })
    const file = await processor.process('Hello <script>alert("xss")</script> World')
    const html = String(file)
    // The <script> tag is stripped; the text content may remain as plain text
    expect(html).not.toContain('<script>')
  })

  it('strips onclick attributes', async () => {
    const { processor } = await buildProcessor({ sanitize: true })
    const file = await processor.process('<a onclick="evil()" href="#">link</a>')
    const html = String(file)
    expect(html).not.toContain('onclick')
  })

  it('allows standard markdown output through', async () => {
    const { processor } = await buildProcessor({ sanitize: true })
    const file = await processor.process('# Heading\n\nA **bold** paragraph with a [link](https://example.com).')
    const html = String(file)
    expect(html).toContain('<h1')
    expect(html).toContain('<strong>')
    expect(html).toContain('<a')
  })

  it('passes through when sanitize is disabled', async () => {
    const { processor } = await buildProcessor({ sanitize: false })
    const file = await processor.process('Hello <script>alert("xss")</script>')
    const html = String(file)
    expect(html).toContain('<script>')
  })
})
