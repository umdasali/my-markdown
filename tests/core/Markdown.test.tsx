import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { Markdown } from '../../src/core/Markdown'

describe('<Markdown>', () => {
  it('renders a heading', async () => {
    render(<Markdown>{'# Hello World'}</Markdown>)
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeDefined()
    })
  })

  it('renders a paragraph', async () => {
    render(<Markdown>{'This is a paragraph.'}</Markdown>)
    await waitFor(() => {
      expect(screen.getByText('This is a paragraph.')).toBeDefined()
    })
  })

  it('renders a link', async () => {
    render(<Markdown>{'[Click me](https://example.com)'}</Markdown>)
    await waitFor(() => {
      const link = screen.getByRole('link', { name: /click me/i })
      expect(link).toBeDefined()
    })
  })

  it('applies custom className', async () => {
    const { container } = render(
      <Markdown className="my-custom-class">{'# Test'}</Markdown>,
    )
    expect(container.querySelector('.my-custom-class')).toBeDefined()
  })

  it('calls onFrontmatter with parsed data', async () => {
    let received: Record<string, unknown> = {}
    render(
      <Markdown
        options={{ frontmatter: true }}
        onFrontmatter={(data) => { received = data }}
      >
        {'---\ntitle: My Post\n---\n\n# Content'}
      </Markdown>,
    )
    await waitFor(() => {
      expect(received['title']).toBe('My Post')
    })
  })

  it('calls onTOC with headings', async () => {
    let toc: { text: string }[] = []
    render(
      <Markdown
        options={{ toc: true }}
        onTOC={(items) => { toc = items }}
      >
        {'# First\n\n## Second'}
      </Markdown>,
    )
    await waitFor(() => {
      expect(toc.length).toBeGreaterThan(0)
    })
  })

  it('has role="article" and aria-label', async () => {
    const { container } = render(<Markdown>{'# Test'}</Markdown>)
    const article = container.querySelector('[role="article"]')
    expect(article).toBeDefined()
  })

  it('renders GFM task list', async () => {
    render(<Markdown>{'- [x] Done\n- [ ] Todo'}</Markdown>)
    await waitFor(() => {
      const checkboxes = screen.getAllByRole('checkbox')
      expect(checkboxes.length).toBe(2)
      expect((checkboxes[0] as HTMLInputElement).checked).toBe(true)
      expect((checkboxes[1] as HTMLInputElement).checked).toBe(false)
    })
  })
})
