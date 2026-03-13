import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { H1, H2, H3 } from '../../src/components/Heading'
import { MarkdownProvider } from '../../src/core/context'

function Wrapper({ children }: { children: React.ReactNode }) {
  return <MarkdownProvider>{children}</MarkdownProvider>
}

describe('<Heading>', () => {
  it('renders h1 with correct tag', () => {
    const { container } = render(<H1>Title</H1>, { wrapper: Wrapper })
    expect(container.querySelector('h1')).toBeDefined()
  })

  it('renders h2 with correct tag', () => {
    const { container } = render(<H2>Section</H2>, { wrapper: Wrapper })
    expect(container.querySelector('h2')).toBeDefined()
  })

  it('renders anchor link when id is provided', () => {
    const { container } = render(<H3 id="my-heading">Section</H3>, { wrapper: Wrapper })
    const anchor = container.querySelector('a[href="#my-heading"]')
    expect(anchor).toBeDefined()
  })

  it('sets id attribute on heading', () => {
    const { container } = render(<H2 id="test-id">Title</H2>, { wrapper: Wrapper })
    expect(container.querySelector('#test-id')).toBeDefined()
  })

  it('applies className', () => {
    const { container } = render(<H1 className="custom">Title</H1>, { wrapper: Wrapper })
    const h1 = container.querySelector('h1')
    expect(h1?.className).toContain('custom')
  })
})
