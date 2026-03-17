# react-markdown-ziri

A feature-rich, production-ready Markdown renderer for React and Next.js — built on the [unified](https://unifiedjs.com/) ecosystem.

- **Zero config** — works out of the box with sensible defaults
- **GFM support** — tables, task lists, strikethrough, autolinks
- **Syntax highlighting** — powered by [Shiki](https://shiki.matsu.io/) with automatic language detection
- **Math** — KaTeX rendering for inline and block expressions
- **Diagrams** — Mermaid diagram support
- **Table of Contents** — auto-generated with scrollspy active-item tracking
- **Frontmatter** — YAML frontmatter extraction
- **Themes** — built-in `light` / `dark` / `github` / `dracula` + custom theme support via CSS custom properties
- **React Server Components** — async `MarkdownServer` for Next.js App Router
- **Fully typed** — strict TypeScript throughout

---

## Installation

```bash
npm install react-markdown-ziri
# or
yarn add react-markdown-ziri
# or
pnpm add react-markdown-ziri
```

### Optional peer dependencies

```bash
# Math rendering (required for options.math)
npm install katex

# Diagram rendering (required for options.mermaid)
npm install mermaid
```

---

## Quick Start

```tsx
import { Markdown } from 'react-markdown-ziri'
import 'react-markdown-ziri/styles/base.css'

export default function App() {
  return (
    <Markdown>
      {`# Hello World

This is **bold**, _italic_, and \`inline code\`.

\`\`\`typescript
const greet = (name: string) => \`Hello, \${name}!\`
\`\`\`
      `}
    </Markdown>
  )
}
```

---

## API Reference

### `<Markdown>`

The main client-side component. Renders markdown on the client using React hooks.

```tsx
import { Markdown } from 'react-markdown-ziri'

<Markdown
  theme="light"
  options={{ gfm: true, highlight: true }}
  className="my-prose"
  onFrontmatter={(data) => console.log(data)}
  onTOC={(items) => console.log(items)}
>
  {markdownString}
</Markdown>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `string` | — | Markdown source string |
| `options` | `MarkdownOptions` | `{}` | Parsing and rendering options |
| `components` | `Partial<MarkdownComponents>` | — | Override default rendered components |
| `theme` | `ThemeName \| ThemeConfig` | `"light"` | Color theme |
| `className` | `string` | — | CSS class on the `<article>` wrapper |
| `style` | `CSSProperties` | — | Inline styles on the wrapper |
| `id` | `string` | — | HTML `id` attribute |
| `aria-label` | `string` | `"Markdown content"` | ARIA label |
| `onFrontmatter` | `(data: Record<string, unknown>) => void` | — | Called when frontmatter is parsed |
| `onTOC` | `(items: TOCItem[]) => void` | — | Called when the TOC is extracted |

---

### `MarkdownOptions`

All options are optional. Pass via the `options` prop.

```tsx
<Markdown options={{
  gfm: true,
  frontmatter: true,
  highlight: true,
  math: true,
  mermaid: true,
  toc: true,
  headingAnchors: true,
  sanitize: true,
  lineNumbers: true,
}}>
  {source}
</Markdown>
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `gfm` | `boolean` | `true` | GitHub Flavored Markdown (tables, task lists, strikethrough) |
| `frontmatter` | `boolean` | `false` | Parse YAML frontmatter |
| `highlight` | `boolean \| HighlightOptions` | `true` | Syntax highlighting via Shiki |
| `math` | `boolean \| MathOptions` | `false` | Math rendering via KaTeX |
| `mermaid` | `boolean \| MermaidOptions` | `false` | Mermaid diagram rendering |
| `toc` | `boolean \| TOCOptions` | `false` | Extract table of contents |
| `headingAnchors` | `boolean \| HeadingAnchorOptions` | `true` | Add anchor links to headings |
| `sanitize` | `boolean \| SanitizeOptions` | `true` | Sanitize HTML (strip XSS) |
| `lineNumbers` | `boolean` | `false` | Show line numbers in code blocks |
| `externalLinks` | `ExternalLinkOptions` | — | Control external link behavior |
| `images` | `ImageOptions` | — | Image rendering options |
| `plugins` | `MarkdownPlugin[]` | `[]` | Custom remark/rehype plugins |

#### `HighlightOptions`

```ts
{
  theme?: string                    // Single Shiki theme name (auto-derived from the theme prop by default)
  themes?: { light: string; dark: string }  // Dual themes (light/dark via CSS variables)
  defaultLanguage?: string          // Fallback language when none is detected (default: 'text')
  showCopyButton?: boolean          // Show copy-to-clipboard button (default: true)
  showLanguageLabel?: boolean       // Show language badge in code header (default: true)
}
```

When you pass `theme="dark"` (or any built-in theme) to `<Markdown>`, the code block automatically picks the matching Shiki theme (`github-dark` for dark, `github-light` for light/github, `dracula` for dracula). You only need `HighlightOptions.theme` to override this.

#### `HeadingAnchorOptions`

```ts
{
  icon?: ReactNode        // Custom anchor icon (default: '#' symbol)
  className?: string      // CSS class on the anchor element
  position?: 'before' | 'after'  // Anchor position relative to heading text (default: 'before')
  ariaLabel?: string      // ARIA label on the anchor link
}
```

#### `TOCOptions`

```ts
{
  maxDepth?: 1 | 2 | 3 | 4 | 5 | 6  // Deepest heading level to include (default: 6)
  ordered?: boolean                   // Use <ol> instead of <ul>
  title?: string                      // Optional heading above the TOC
}
```

#### `MathOptions`

```ts
{
  throwOnError?: boolean             // Throw on invalid LaTeX (default: false)
  macros?: Record<string, string>    // Custom KaTeX macros
  displayMode?: boolean              // Force display mode for all math
}
```

#### `MermaidOptions`

```ts
{
  theme?: 'default' | 'dark' | 'forest' | 'neutral' | 'base'
  securityLevel?: 'strict' | 'loose' | 'antiscript'
  fontFamily?: string
}
```

#### `SanitizeOptions`

```ts
{
  allowlist?: {
    tagNames?: string[]                       // Additional allowed HTML tags
    attributes?: Record<string, string[]>     // Additional allowed attributes per tag
    protocols?: Record<string, string[]>      // Additional allowed URL protocols
  }
  allowMath?: boolean     // Allow KaTeX-generated elements (default: true when math is enabled)
  allowMermaid?: boolean  // Allow Mermaid-generated elements (default: true when mermaid is enabled)
}
```

#### `ExternalLinkOptions`

```ts
{
  target?: '_blank' | '_self'   // Link target (default: '_blank')
  rel?: string                  // rel attribute (default: 'noopener noreferrer')
  icon?: ReactNode              // Icon appended to external link text
  newTabAriaLabel?: string      // Screen reader label for new-tab links
}
```

---

### `<MarkdownProvider>`

Wrap multiple `<Markdown>` components to share options, components, and theme without repeating props.

```tsx
import { MarkdownProvider, Markdown } from 'react-markdown-ziri'

<MarkdownProvider
  theme="dark"
  options={{ gfm: true, highlight: true, headingAnchors: true }}
>
  <Markdown>{postOne}</Markdown>
  <Markdown>{postTwo}</Markdown>
</MarkdownProvider>
```

---

## Themes

### Built-in themes

Pass a theme name to `<Markdown>` or `<MarkdownProvider>`:

```tsx
<Markdown theme="light">{source}</Markdown>    // default
<Markdown theme="dark">{source}</Markdown>
<Markdown theme="github">{source}</Markdown>
<Markdown theme="dracula">{source}</Markdown>
<Markdown theme="system">{source}</Markdown>   // follows OS preference via CSS media query
```

Each theme also sets the matching Shiki theme for code blocks automatically.

### Custom theme

```tsx
import type { ThemeConfig } from 'react-markdown-ziri'

const myTheme: ThemeConfig = {
  name: 'catppuccin',
  code: 'catppuccin-mocha',   // Shiki theme for code blocks
  colors: {
    text: '#cdd6f4',
    textMuted: '#6c7086',
    background: '#1e1e2e',
    backgroundSecondary: '#181825',
    border: '#313244',
    link: '#89b4fa',
    linkHover: '#b4d0fb',
    codeBackground: '#181825',
    codeText: '#cdd6f4',
    blockquoteBorder: '#45475a',
    blockquoteBackground: '#181825',
    tableHeaderBackground: '#181825',
    tableRowHover: '#313244',
    headingAnchor: '#6c7086',
  },
}

<Markdown theme={myTheme}>{source}</Markdown>
```

### CSS custom properties

The theme is applied as inline CSS custom properties on the `<article>` element. Override any value globally or locally:

```css
/* Global override */
:root {
  --mdkit-text: #1a1a1a;
  --mdkit-bg: #ffffff;
  --mdkit-bg-secondary: #f9fafb;
  --mdkit-border: #e5e7eb;
  --mdkit-link: #2563eb;
  --mdkit-link-hover: #1d4ed8;
  --mdkit-code-bg: #f3f4f6;
  --mdkit-code-text: #1f2937;
  --mdkit-blockquote-border: #d1d5db;
  --mdkit-blockquote-bg: #f9fafb;
  --mdkit-table-header-bg: #f3f4f6;
  --mdkit-table-row-hover: #f9fafb;
  --mdkit-heading-anchor: #9ca3af;
  --mdkit-text-muted: #6b7280;

  /* Typography */
  --mdkit-font-sans: system-ui, sans-serif;
  --mdkit-font-mono: ui-monospace, monospace;
  --mdkit-font-size: 1rem;
  --mdkit-line-height: 1.75;
  --mdkit-radius: 0.375rem;
}
```

### Theme stylesheets

```ts
import 'react-markdown-ziri/styles/base.css'   // required — includes light theme variables + system dark mode
import 'react-markdown-ziri/styles/dark.css'   // optional — explicit dark class + media query override
import 'react-markdown-ziri/styles/light.css'  // optional — explicit light class override
```

### `useTheme` hook

For toggling themes with persistence:

```tsx
import { useTheme } from 'react-markdown-ziri'

function ThemeToggle() {
  const { theme, preference, setTheme } = useTheme()

  return (
    <button onClick={() => setTheme(preference === 'dark' ? 'light' : 'dark')}>
      Current: {theme}
    </button>
  )
}
```

| Field | Type | Description |
|-------|------|-------------|
| `theme` | `'light' \| 'dark'` | Resolved theme (after applying system preference) |
| `preference` | `'light' \| 'dark' \| 'system'` | Stored preference |
| `setTheme` | `(pref: ThemePreference) => void` | Update preference (persisted to `localStorage`) |

---

## Table of Contents

```tsx
import { Markdown } from 'react-markdown-ziri'
import { TOC } from 'react-markdown-ziri/toc'
import { useState } from 'react'
import type { TOCItem } from 'react-markdown-ziri'

function Page({ source }: { source: string }) {
  const [toc, setToc] = useState<TOCItem[]>([])

  return (
    <div className="layout">
      <aside>
        <TOC items={toc} title="On this page" />
      </aside>
      <main>
        <Markdown options={{ toc: true, headingAnchors: true }} onTOC={setToc}>
          {source}
        </Markdown>
      </main>
    </div>
  )
}
```

#### `<TOC>` Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `TOCItem[]` | — | TOC items (from `onTOC` callback) |
| `title` | `string` | — | Optional heading above the list |
| `maxDepth` | `number` | `6` | Maximum nesting depth to render |
| `ordered` | `boolean` | `false` | Use `<ol>` instead of `<ul>` |

#### `TOCItem`

```ts
interface TOCItem {
  id: string
  text: string
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: TOCItem[]
}
```

---

## `useMarkdown` Hook

Access the markdown pipeline directly without the `<Markdown>` component.

```tsx
import { useMarkdown } from 'react-markdown-ziri'

function MyComponent({ source }: { source: string }) {
  const { content, frontmatter, toc, isLoading, error } = useMarkdown(source, {
    gfm: true,
    highlight: true,
  })

  if (isLoading) return <div>Loading…</div>
  if (error) return <div>Error: {error.message}</div>

  return <article>{content}</article>
}
```

| Field | Type | Description |
|-------|------|-------------|
| `content` | `ReactNode` | Rendered React nodes |
| `frontmatter` | `Record<string, unknown> \| null` | Parsed frontmatter data |
| `toc` | `TOCItem[]` | Table of contents items |
| `isLoading` | `boolean` | `true` while processing |
| `error` | `Error \| null` | Processing error, if any |

---

## Custom Components

Replace any default rendered element with your own React component.

```tsx
import { Markdown } from 'react-markdown-ziri'
import type { MarkdownComponents, HeadingProps, LinkProps } from 'react-markdown-ziri'

const components: Partial<MarkdownComponents> = {
  h1: ({ children, id }: HeadingProps) => (
    <h1 id={id} className="text-4xl font-bold tracking-tight">
      {children}
    </h1>
  ),

  a: ({ href, children }: LinkProps) => (
    <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
      {children}
    </a>
  ),
}

<Markdown components={components}>{source}</Markdown>
```

Available component keys: `h1` `h2` `h3` `h4` `h5` `h6` `p` `a` `img` `pre` `code` `table` `thead` `tbody` `tr` `th` `td` `blockquote` `ul` `ol` `li` `hr` `strong` `em` `del`

---

## React Server Components (Next.js App Router)

Use `MarkdownServer` for zero client-side JavaScript. Renders markdown entirely on the server.

```tsx
// app/blog/[slug]/page.tsx
import { MarkdownServer } from 'react-markdown-ziri/server'
import 'react-markdown-ziri/styles/base.css'

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const source = await fetchMarkdown(params.slug)

  return (
    <MarkdownServer options={{ gfm: true, highlight: true, headingAnchors: true }}>
      {source}
    </MarkdownServer>
  )
}
```

### `serializeMarkdown` (SSG / `getStaticProps`)

Pre-process markdown at build time and pass the serialized result to a client component.

```tsx
import { serializeMarkdown } from 'react-markdown-ziri/server'

export async function getStaticProps() {
  const source = await fs.readFile('content/post.md', 'utf8')
  const serialized = await serializeMarkdown(source, { gfm: true, highlight: true })

  return { props: { serialized } }
}
```

---

## Frontmatter

```tsx
import { Markdown } from 'react-markdown-ziri'
import { useState } from 'react'

function BlogPost({ source }: { source: string }) {
  const [meta, setMeta] = useState<Record<string, unknown>>({})

  return (
    <>
      <h1>{String(meta.title ?? '')}</h1>
      <Markdown options={{ frontmatter: true }} onFrontmatter={setMeta}>
        {source}
      </Markdown>
    </>
  )
}
```

Input:

```markdown
---
title: My Post
author: Alice
published: true
tags: [react, markdown]
---

Content starts here...
```

`onFrontmatter` receives `{ title: 'My Post', author: 'Alice', published: true, tags: ['react', 'markdown'] }`.

---

## Math

Requires `katex` peer dependency.

```tsx
<Markdown options={{ math: true }}>
  {`
Inline: $E = mc^2$

Block:

$$
\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}
$$
  `}
</Markdown>
```

---

## Mermaid Diagrams

Requires `mermaid` peer dependency.

```tsx
<Markdown options={{ mermaid: true }}>
  {`
\`\`\`mermaid
graph TD
  A[Start] --> B{Decision}
  B -->|Yes| C[Action]
  B -->|No| D[Other]
\`\`\`
  `}
</Markdown>
```

---

## Syntax Highlighting

Powered by [Shiki](https://shiki.matsu.io/). The shiki theme is automatically derived from the `theme` prop:

| `theme` prop | Shiki theme used |
|---|---|
| `"light"` | `github-light` |
| `"dark"` | `github-dark` |
| `"github"` | `github-light` |
| `"dracula"` | `dracula` |
| `"system"` | `github-light` (OS-adaptive via CSS) |
| Custom `ThemeConfig` | Value of `ThemeConfig.code` |

Override the shiki theme explicitly:

```tsx
<Markdown
  theme="dark"
  options={{
    highlight: {
      theme: 'one-dark-pro',          // single theme
      // or dual themes:
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  }}
>
  {source}
</Markdown>
```

### Copy button

Code blocks include a built-in copy-to-clipboard button. Style it with:

```css
.mdkit-copy-btn { /* idle state */ }
.mdkit-copy-btn--copied { /* after copy */ }
```

### Line numbers

```tsx
<Markdown options={{ lineNumbers: true }}>{source}</Markdown>
```

---

## Custom Plugins

Extend the unified pipeline with remark or rehype plugins.

```tsx
import remarkGemoji from 'remark-gemoji'
import rehypeExternalLinks from 'rehype-external-links'
import { createPlugin } from 'react-markdown-ziri'

const plugins = [
  createPlugin('remark', remarkGemoji),
  createPlugin('rehype', rehypeExternalLinks, { target: '_blank' }),
]

<Markdown options={{ plugins }}>{source}</Markdown>
```

---

## Next.js Setup

### App Router (`app/`)

No special setup needed. Use `MarkdownServer` from `react-markdown-ziri/server` for server components.

### Pages Router (`pages/`)

If you encounter ESM issues, add to `next.config.js`:

```js
module.exports = {
  transpilePackages: ['react-markdown-ziri'],
}
```

---

## TypeScript

All public types are exported from the main entry point:

```ts
import type {
  MarkdownProps,
  MarkdownOptions,
  MarkdownComponents,
  TOCItem,
  ThemeName,
  ThemeConfig,
  ThemeColors,
  HeadingProps,
  LinkProps,
  ImageProps,
  CodeProps,
  PreProps,
  ListItemProps,
  TableProps,
  HighlightOptions,
  HeadingAnchorOptions,
  TOCOptions,
  MathOptions,
  MermaidOptions,
  SanitizeOptions,
  ExternalLinkOptions,
  ImageOptions,
  MarkdownPlugin,
  SerializedMarkdown,
} from 'react-markdown-ziri'
```

---

## Bundle Size

| Entry | Size (minified + gzip) |
|-------|------------------------|
| `react-markdown-ziri` | ~28 KB |
| `react-markdown-ziri/toc` | ~11 KB |
| `react-markdown-ziri/themes` | ~3 KB |
| `react-markdown-ziri/server` | ~31 KB |

Shiki, KaTeX, and Mermaid are loaded dynamically — they do not contribute to your initial bundle.

---

## License

MIT
