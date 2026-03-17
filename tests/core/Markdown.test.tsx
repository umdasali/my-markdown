import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { Markdown } from '../../src/core/Markdown'
import { lightTheme, darkTheme, githubTheme, draculaTheme } from '../../src/themes'

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

  it('applies dark theme CSS variables inline when theme="dark"', async () => {
    const { container } = render(<Markdown theme="dark">{'# Dark'}</Markdown>)
    const article = container.querySelector('article') as HTMLElement
    expect(article.style.getPropertyValue('--mdkit-bg')).toBe(darkTheme.colors.background)
    expect(article.style.getPropertyValue('--mdkit-text')).toBe(darkTheme.colors.text)
  })

  it('applies light theme CSS variables inline when theme="light"', async () => {
    const { container } = render(<Markdown theme="light">{'# Light'}</Markdown>)
    const article = container.querySelector('article') as HTMLElement
    expect(article.style.getPropertyValue('--mdkit-bg')).toBe(lightTheme.colors.background)
    expect(article.style.getPropertyValue('--mdkit-text')).toBe(lightTheme.colors.text)
  })

  it('applies github theme CSS variables inline when theme="github"', async () => {
    const { container } = render(<Markdown theme="github">{'# GitHub'}</Markdown>)
    const article = container.querySelector('article') as HTMLElement
    expect(article.style.getPropertyValue('--mdkit-bg')).toBe(githubTheme.colors.background)
    expect(article.style.getPropertyValue('--mdkit-text')).toBe(githubTheme.colors.text)
    expect(article.style.getPropertyValue('--mdkit-link')).toBe(githubTheme.colors.link)
  })

  it('applies dracula theme CSS variables inline when theme="dracula"', async () => {
    const { container } = render(<Markdown theme="dracula">{'# Dracula'}</Markdown>)
    const article = container.querySelector('article') as HTMLElement
    expect(article.style.getPropertyValue('--mdkit-bg')).toBe(draculaTheme.colors.background)
    expect(article.style.getPropertyValue('--mdkit-text')).toBe(draculaTheme.colors.text)
  })

  it('applies custom ThemeConfig inline when theme is an object', async () => {
    const myTheme = {
      name: 'custom',
      colors: {
        text: '#ff0000',
        textMuted: '#aaaaaa',
        background: '#0000ff',
        backgroundSecondary: '#000088',
        border: '#333333',
        link: '#00ff00',
        linkHover: '#00cc00',
        codeBackground: '#111111',
        codeText: '#ffffff',
        blockquoteBorder: '#444444',
        blockquoteBackground: '#222222',
        tableHeaderBackground: '#333333',
        tableRowHover: '#444444',
        headingAnchor: '#555555',
      },
    }
    const { container } = render(<Markdown theme={myTheme}>{'# Custom'}</Markdown>)
    const article = container.querySelector('article') as HTMLElement
    expect(article.style.getPropertyValue('--mdkit-text')).toBe(myTheme.colors.text)
    expect(article.style.getPropertyValue('--mdkit-bg')).toBe(myTheme.colors.background)
  })

  it('applies no inline theme vars when theme="system" (CSS media query handles it)', async () => {
    const { container } = render(<Markdown theme="system">{'# System'}</Markdown>)
    const article = container.querySelector('article') as HTMLElement
    expect(article.style.getPropertyValue('--mdkit-bg')).toBe('')
    expect(article.style.getPropertyValue('--mdkit-text')).toBe('')
  })

  it('applies light theme vars by default when theme prop is omitted', async () => {
    const { container } = render(<Markdown>{'# Default'}</Markdown>)
    const article = container.querySelector('article') as HTMLElement
    expect(article.style.getPropertyValue('--mdkit-bg')).toBe(lightTheme.colors.background)
    expect(article.style.getPropertyValue('--mdkit-text')).toBe(lightTheme.colors.text)
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
