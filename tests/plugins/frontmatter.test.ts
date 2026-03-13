import { describe, it, expect } from 'vitest'
import { buildProcessor } from '../../src/core/parser'

describe('frontmatter plugin', () => {
  it('parses YAML frontmatter', async () => {
    const { processor, frontmatter } = await buildProcessor({ frontmatter: true })
    await processor.process('---\ntitle: Hello\nauthor: Alice\n---\n\nContent')
    expect(frontmatter!['title']).toBe('Hello')
    expect(frontmatter!['author']).toBe('Alice')
  })

  it('handles missing frontmatter gracefully', async () => {
    const { processor, frontmatter } = await buildProcessor({ frontmatter: true })
    await processor.process('# No frontmatter here')
    expect(Object.keys(frontmatter ?? {})).toHaveLength(0)
  })

  it('handles numeric and boolean frontmatter values', async () => {
    const { processor, frontmatter } = await buildProcessor({ frontmatter: true })
    await processor.process('---\ncount: 42\npublished: true\n---\n')
    expect(frontmatter!['count']).toBe(42)
    expect(frontmatter!['published']).toBe(true)
  })
})
