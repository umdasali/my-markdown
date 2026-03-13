import { describe, it, expect } from 'vitest'
import { buildProcessor } from '../../src/core/parser'

describe('TOC extractor', () => {
  it('builds a nested TOC tree', async () => {
    const { processor, toc } = await buildProcessor({ toc: true })
    await processor.process('# A\n\n## B\n\n### C\n\n## D')

    expect(toc[0]?.text).toBe('A')
    expect(toc[0]?.level).toBe(1)
    expect(toc[0]?.children[0]?.text).toBe('B')
    expect(toc[0]?.children[0]?.children[0]?.text).toBe('C')
    expect(toc[0]?.children[1]?.text).toBe('D')
  })

  it('generates stable IDs for headings', async () => {
    const { processor, toc } = await buildProcessor({ toc: true })
    await processor.process('# Hello World\n\n## Section 1')
    expect(toc[0]?.id).toBe('hello-world')
    expect(toc[0]?.children[0]?.id).toBe('section-1')
  })

  it('respects maxDepth', async () => {
    const { processor, toc } = await buildProcessor({ toc: { maxDepth: 2 } })
    await processor.process('# H1\n\n## H2\n\n### H3 (excluded)')

    const flat = flatTOC(toc)
    expect(flat.every((i) => i.level <= 2)).toBe(true)
    expect(flat.find((i) => i.text === 'H3 (excluded)')).toBeUndefined()
  })
})

function flatTOC(items: { level: number; text: string; children: typeof items }[]): typeof items {
  return items.flatMap((i) => [i, ...flatTOC(i.children)])
}
