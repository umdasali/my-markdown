import { describe, it, expect } from 'vitest'
import { buildProcessor } from '../../src/core/parser'

describe('buildProcessor', () => {
  it('returns a processor with frontmatter and toc slots', async () => {
    const result = await buildProcessor()
    expect(result.processor).toBeDefined()
    expect(result.frontmatter).toBeDefined()
    expect(Array.isArray(result.toc)).toBe(true)
  })

  it('processes markdown to HTML string', async () => {
    const { processor } = await buildProcessor()
    const html = String(await processor.process('# Hello\n\nParagraph.'))
    expect(html).toContain('<h1')
    expect(html).toContain('Paragraph')
  })

  it('extracts frontmatter when enabled', async () => {
    const { processor, frontmatter } = await buildProcessor({ frontmatter: true })
    await processor.process('---\ntitle: Test\n---\n\n# Hello')
    expect(frontmatter!['title']).toBe('Test')
  })

  it('extracts TOC when enabled', async () => {
    const { processor, toc } = await buildProcessor({ toc: true })
    await processor.process('# Heading 1\n\n## Heading 2\n\n### Heading 3')
    expect(toc.length).toBeGreaterThan(0)
    expect(toc[0]?.text).toBe('Heading 1')
    expect(toc[0]?.children[0]?.text).toBe('Heading 2')
  })

  it('respects maxDepth for TOC', async () => {
    const { processor, toc } = await buildProcessor({ toc: { maxDepth: 2 } })
    await processor.process('# H1\n\n## H2\n\n### H3 should be excluded')
    const flat = flattenTOC(toc)
    expect(flat.every((item) => item.level <= 2)).toBe(true)
  })
})

function flattenTOC(items: { level: number; children: typeof items }[]): typeof items {
  return items.flatMap((i) => [i, ...flattenTOC(i.children)])
}
