import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Link } from '../../src/components/Link'
import { MarkdownProvider } from '../../src/core/context'

function Wrapper({ children }: { children: React.ReactNode }) {
  return <MarkdownProvider>{children}</MarkdownProvider>
}

describe('<Link>', () => {
  it('renders a basic link', () => {
    const { container } = render(<Link href="/about">About</Link>, { wrapper: Wrapper })
    const a = container.querySelector('a')
    expect(a?.getAttribute('href')).toBe('/about')
  })

  it('marks external links with target=_blank', () => {
    const { container } = render(
      <Link href="https://example.com">External</Link>,
      { wrapper: Wrapper },
    )
    const a = container.querySelector('a')
    expect(a?.getAttribute('target')).toBe('_blank')
    expect(a?.getAttribute('rel')).toContain('noopener')
  })

  it('does not add target to internal links', () => {
    const { container } = render(<Link href="/internal">Internal</Link>, { wrapper: Wrapper })
    const a = container.querySelector('a')
    expect(a?.getAttribute('target')).toBeNull()
  })

  it('treats anchor links as internal', () => {
    const { container } = render(<Link href="#section">Anchor</Link>, { wrapper: Wrapper })
    const a = container.querySelector('a')
    expect(a?.getAttribute('target')).toBeNull()
  })
})
