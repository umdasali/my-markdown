# react-markdown-ziri

A feature-rich, production-ready Markdown renderer for React and Next.js — built on the [unified](https://unifiedjs.com/) ecosystem.

- **Zero config** — works out of the box with sensible defaults
- **GFM support** — tables, task lists, strikethrough, autolinks
- **Syntax highlighting** — powered by [Shiki](https://shiki.matsu.io/) (server-side, zero client runtime)
- **Math** — KaTeX rendering for inline and block math
- **Diagrams** — Mermaid diagram support
- **Table of Contents** — auto-generated with active-item tracking
- **Frontmatter** — YAML frontmatter extraction
- **Themes** — built-in light/dark/github/dracula themes with CSS custom properties
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
# Math rendering
npm install katex

# Diagram rendering
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

The main client-side component.

```tsx
import { Markdown } from 'react-markdown-ziri'

<Markdown
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
| `components` | `Partial<MarkdownComponents>` | — | Override default components |
| `theme` | `ThemeName \| ThemeConfig` | — | Color theme |
| `className` | `string` | — | CSS class on the `<article>` wrapper |
| `style` | `CSSProperties` | — | Inline styles on the wrapper |
| `id` | `string` | — | HTML id attribute |
| `aria-label` | `string` | `"Markdown content"` | ARIA label |
| `onFrontmatter` | `(data: Record<string, unknown>) => void` | — | Called when frontmatter is parsed |
| `onTOC` | `(items: TOCItem[]) => void` | — | Called when TOC is extracted |

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
}}>
  {source}
</Markdown>
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `gfm` | `boolean` | `true` | GitHub Flavored Markdown (tables, task lists, etc.) |
| `frontmatter` | `boolean` | `false` | Parse YAML frontmatter |
| `highlight` | `boolean \| HighlightOptions` | `false` | Syntax highlighting via Shiki |
| `math` | `boolean \| MathOptions` | `false` | Math rendering via KaTeX |
| `mermaid` | `boolean \| MermaidOptions` | `false` | Mermaid diagram rendering |
| `toc` | `boolean \| TOCOptions` | `false` | Extract table of contents |
| `headingAnchors` | `boolean \| HeadingAnchorOptions` | `false` | Add anchor links to headings |
| `sanitize` | `boolean \| SanitizeOptions` | `false` | Sanitize HTML (strip XSS) |
| `lineNumbers` | `boolean` | `false` | Show line numbers in code blocks |
| `externalLinks` | `ExternalLinkOptions` | — | Control external link behavior |
| `images` | `ImageOptions` | — | Image rendering options |
| `plugins` | `MarkdownPlugin[]` | `[]` | Custom remark/rehype plugins |

#### `HighlightOptions`

```ts
{
  theme?: string          // Shiki theme name (default: 'github-light')
  darkTheme?: string      // Theme for dark mode (default: 'github-dark')
  langs?: string[]        // Pre-load specific languages
}
```

#### `TOCOptions`

```ts
{
  maxDepth?: number       // Maximum heading depth (default: 3)
  minDepth?: number       // Minimum heading depth (default: 1)
}
```

#### `HeadingAnchorOptions`

```ts
{
  position?: 'before' | 'after'   // Anchor position (default: 'before')
  label?: string                   // Anchor link text (default: '#')
  className?: string               // CSS class on the anchor
}
```

#### `SanitizeOptions`

```ts
{
  allowedTags?: string[]           // Tags to allow (adds to defaults)
  allowedAttributes?: Record<string, string[]>  // Attributes to allow
  stripComments?: boolean          // Strip HTML comments (default: true)
}
```

---

### `useMarkdown` Hook

Use the pipeline directly without the `<Markdown>` component.

```tsx
import { useMarkdown } from 'react-markdown-ziri'

function MyComponent({ source }: { source: string }) {
  const { content, frontmatter, toc, isLoading, error } = useMarkdown(source, {
    gfm: true,
    highlight: true,
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return <article>{content}</article>
}
```

#### Return value

| Field | Type | Description |
|-------|------|-------------|
| `content` | `ReactNode` | Rendered React nodes |
| `frontmatter` | `Record<string, unknown> \| null` | Parsed frontmatter data |
| `toc` | `TOCItem[]` | Table of contents |
| `isLoading` | `boolean` | `true` while processing |
| `error` | `Error \| null` | Processing error if any |

---

## Table of Contents

The `<TOC>` component renders an auto-generated, scrollspy-enabled table of contents.

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
| `maxDepth` | `number` | `3` | Maximum nesting depth to render |
| `ordered` | `boolean` | `false` | Use `<ol>` instead of `<ul>` |
| `activeClassName` | `string` | `"mdkit-toc-item--active"` | Class on the active item |
| `itemClassName` | `string` | — | Class on every item |
| `onItemClick` | `(item: TOCItem) => void` | — | Click callback |

#### `TOCItem` type

```ts
interface TOCItem {
  id: string
  text: string
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: TOCItem[]
}
```

---

## Themes

### Built-in themes

```tsx
import { Markdown } from 'react-markdown-ziri'

<Markdown theme="github">
  {source}
</Markdown>
```

Available theme names: `"light"` | `"dark"` | `"github"` | `"dracula"`

### Custom theme

```tsx
import type { ThemeConfig } from 'react-markdown-ziri'

const myTheme: ThemeConfig = {
  name: 'my-theme',
  colors: {
    background: '#1e1e2e',
    foreground: '#cdd6f4',
    primary: '#89b4fa',
    // ...
  },
}

<Markdown theme={myTheme}>{source}</Markdown>
```

### CSS custom properties

All theme values are exposed as CSS custom properties. You can override them globally:

```css
.mdkit-root {
  --mdkit-color-bg: #ffffff;
  --mdkit-color-text: #1a1a1a;
  --mdkit-color-primary: #0070f3;
  --mdkit-color-code-bg: #f5f5f5;
  --mdkit-color-border: #e5e5e5;
  --mdkit-font-body: 'Inter', sans-serif;
  --mdkit-font-mono: 'Fira Code', monospace;
  --mdkit-font-size-base: 1rem;
  --mdkit-line-height: 1.7;
  --mdkit-radius: 0.375rem;
}
```

Import pre-built theme stylesheets:

```ts
import 'react-markdown-ziri/styles/base.css'    // required base styles
import 'react-markdown-ziri/styles/light.css'   // light theme variables
import 'react-markdown-ziri/styles/dark.css'    // dark theme variables
```

---

## Custom Components

Replace any default rendered element with your own React component.

```tsx
import { Markdown } from 'react-markdown-ziri'
import type { MarkdownComponents, HeadingProps, LinkProps } from 'react-markdown-ziri'

const components: Partial<MarkdownComponents> = {
  // Custom heading with your design system
  h1: ({ children, id }) => (
    <h1 id={id} className="text-4xl font-bold tracking-tight">
      {children}
    </h1>
  ),

  // Open external links in new tab with icon
  a: ({ href, children }) => (
    <a href={href} target={href?.startsWith('http') ? '_blank' : undefined}>
      {children}
    </a>
  ),

  // Custom code block
  pre: ({ children, 'data-language': lang }) => (
    <div className={`code-block lang-${lang}`}>
      {children}
    </div>
  ),
}

<Markdown components={components}>{source}</Markdown>
```

#### Available component keys

`h1` `h2` `h3` `h4` `h5` `h6` `p` `a` `img` `pre` `code` `table` `thead` `tbody` `tr` `th` `td` `blockquote` `ul` `ol` `li` `hr` `strong` `em` `del`

---

## React Server Components (Next.js App Router)

Use `MarkdownServer` for zero client-side JavaScript. It renders markdown entirely on the server.

```tsx
// app/blog/[slug]/page.tsx
import { MarkdownServer } from 'react-markdown-ziri/server'
import 'react-markdown-ziri/styles/base.css'

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const source = await fetchMarkdown(params.slug)

  return (
    <MarkdownServer
      options={{ gfm: true, highlight: true, headingAnchors: true }}
    >
      {source}
    </MarkdownServer>
  )
}
```

### `serializeMarkdown` (SSG / `getStaticProps`)

Pre-process markdown at build time and pass the result to a client component.

```tsx
// For Next.js Pages Router or any SSG scenario
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

The `onFrontmatter` callback receives `{ title: 'My Post', author: 'Alice', published: true, tags: ['react', 'markdown'] }`.

---

## Math

Requires `katex` peer dependency.

```tsx
<Markdown options={{ math: true }}>
  {`
Inline math: $E = mc^2$

Block math:

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

## Custom Plugins

Extend the pipeline with your own remark or rehype plugins.

```tsx
import remarkGemoji from 'remark-gemoji'
import rehypeExternalLinks from 'rehype-external-links'
import { createPlugin } from 'react-markdown-ziri'

const plugins = [
  createPlugin('remark', remarkGemoji),
  createPlugin('rehype', rehypeExternalLinks, { target: '_blank' }),
]

<Markdown options={{ plugins }}>
  {source}
</Markdown>
```

---

## Syntax Highlighting

Uses [Shiki](https://shiki.matsu.io/) for accurate, server-rendered syntax highlighting. No client-side runtime.

```tsx
<Markdown options={{
  highlight: {
    theme: 'github-light',
    darkTheme: 'github-dark',
  }
}}>
  {source}
</Markdown>
```

The dark theme is automatically applied when the user's system preference is `prefers-color-scheme: dark` or when the `data-theme="dark"` attribute is set on a parent element.

### Copy button

Code blocks include a built-in copy button. Style it with:

```css
.mdkit-copy-button { /* ... */ }
.mdkit-copy-button--copied { /* ... */ }
```

### Line numbers

```tsx
<Markdown options={{ highlight: true, lineNumbers: true }}>
  {source}
</Markdown>
```

---

## TypeScript

All types are exported from the main entry point.

```ts
import type {
  MarkdownProps,
  MarkdownOptions,
  MarkdownComponents,
  TOCItem,
  ThemeName,
  ThemeConfig,
  HeadingProps,
  LinkProps,
  ImageProps,
  CodeBlockProps,
  MarkdownPlugin,
} from 'react-markdown-ziri'
```

---

## Next.js Setup

### App Router (`app/`)

No special setup needed — just import and use. For server-side rendering use `MarkdownServer` from `react-markdown-ziri/server`.

### Pages Router (`pages/`)

Add `react-markdown-ziri` to `next.config.js` transpile list if needed (for ESM packages):

```js
// next.config.js
module.exports = {
  transpilePackages: ['react-markdown-ziri'],
}
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
