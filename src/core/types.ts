import type { ComponentType, CSSProperties, ReactNode } from 'react'

// ---------------------------------------------------------------------------
// Component override map
// ---------------------------------------------------------------------------

export interface HeadingProps {
  id?: string
  level: 1 | 2 | 3 | 4 | 5 | 6
  children?: ReactNode
  className?: string
}

export interface LinkProps {
  href?: string
  children?: ReactNode
  className?: string
  title?: string
  target?: string
  rel?: string
}

export interface ImageProps {
  src?: string
  alt?: string
  title?: string
  width?: number
  height?: number
  className?: string
}

export interface CodeProps {
  children?: ReactNode
  className?: string
  inline?: boolean
}

export interface PreProps {
  children?: ReactNode
  className?: string
}

export interface ListItemProps {
  children?: ReactNode
  className?: string
  checked?: boolean | null
}

export interface TableProps {
  children?: ReactNode
  className?: string
}

export interface MarkdownComponents {
  h1?: ComponentType<HeadingProps>
  h2?: ComponentType<HeadingProps>
  h3?: ComponentType<HeadingProps>
  h4?: ComponentType<HeadingProps>
  h5?: ComponentType<HeadingProps>
  h6?: ComponentType<HeadingProps>
  p?: ComponentType<{ children?: ReactNode; className?: string }>
  a?: ComponentType<LinkProps>
  img?: ComponentType<ImageProps>
  code?: ComponentType<CodeProps>
  pre?: ComponentType<PreProps>
  table?: ComponentType<TableProps>
  thead?: ComponentType<{ children?: ReactNode; className?: string }>
  tbody?: ComponentType<{ children?: ReactNode; className?: string }>
  tr?: ComponentType<{ children?: ReactNode; className?: string }>
  th?: ComponentType<{ children?: ReactNode; className?: string; align?: string }>
  td?: ComponentType<{ children?: ReactNode; className?: string; align?: string }>
  blockquote?: ComponentType<{ children?: ReactNode; className?: string }>
  ul?: ComponentType<{ children?: ReactNode; className?: string }>
  ol?: ComponentType<{ children?: ReactNode; className?: string; start?: number }>
  li?: ComponentType<ListItemProps>
  hr?: ComponentType<{ className?: string }>
  strong?: ComponentType<{ children?: ReactNode; className?: string }>
  em?: ComponentType<{ children?: ReactNode; className?: string }>
  del?: ComponentType<{ children?: ReactNode; className?: string }>
}

// ---------------------------------------------------------------------------
// Feature option interfaces
// ---------------------------------------------------------------------------

export interface HeadingAnchorOptions {
  icon?: ReactNode
  className?: string
  position?: 'before' | 'after'
  ariaLabel?: string
}

export interface HighlightOptions {
  theme?: string
  themes?: { light: string; dark: string }
  defaultLanguage?: string
  showCopyButton?: boolean
  showLanguageLabel?: boolean
}

export interface MathOptions {
  throwOnError?: boolean
  macros?: Record<string, string>
  displayMode?: boolean
}

export interface MermaidOptions {
  theme?: 'default' | 'dark' | 'forest' | 'neutral' | 'base'
  securityLevel?: 'strict' | 'loose' | 'antiscript'
  fontFamily?: string
}

export interface ExternalLinkOptions {
  target?: '_blank' | '_self'
  rel?: string
  icon?: ReactNode
  newTabAriaLabel?: string
}

export type ImageLoader = (params: { src: string; width: number; quality?: number }) => string

export interface ImageOptions {
  useNextImage?: boolean
  loader?: ImageLoader
  sizes?: string
  quality?: number
  lazyLoad?: boolean
}

export interface SanitizeAllowlist {
  tagNames?: string[]
  attributes?: Record<string, string[]>
  protocols?: Record<string, string[]>
}

export type SanitizeOptions =
  | boolean
  | {
      allowlist?: SanitizeAllowlist
      allowMath?: boolean
      allowMermaid?: boolean
    }

export interface TOCOptions {
  maxDepth?: 1 | 2 | 3 | 4 | 5 | 6
  ordered?: boolean
  title?: string
}

// ---------------------------------------------------------------------------
// Markdown options (full config)
// ---------------------------------------------------------------------------

export interface MarkdownOptions {
  gfm?: boolean
  frontmatter?: boolean
  headingAnchors?: boolean | HeadingAnchorOptions
  highlight?: boolean | HighlightOptions
  math?: boolean | MathOptions
  mermaid?: boolean | MermaidOptions
  sanitize?: SanitizeOptions
  toc?: boolean | TOCOptions
  lineNumbers?: boolean
  externalLinks?: ExternalLinkOptions
  images?: ImageOptions
  plugins?: MarkdownPlugin[]
}

// ---------------------------------------------------------------------------
// Root <Markdown> component props
// ---------------------------------------------------------------------------

export interface MarkdownProps {
  children: string
  components?: Partial<MarkdownComponents>
  options?: MarkdownOptions
  className?: string
  style?: CSSProperties
  theme?: ThemeName | ThemeConfig
  onFrontmatter?: (data: Record<string, unknown>) => void
  onTOC?: (items: TOCItem[]) => void
  'aria-label'?: string
  id?: string
}

// ---------------------------------------------------------------------------
// TOC types
// ---------------------------------------------------------------------------

export interface TOCItem {
  id: string
  text: string
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: TOCItem[]
}

// ---------------------------------------------------------------------------
// Theme types
// ---------------------------------------------------------------------------

export type ThemeName = 'light' | 'dark' | 'github' | 'dracula' | 'light-green' | 'light-orange' | 'light-pink' | 'light-purple' | 'dark-green' | 'dark-orange' | 'dark-pink' | 'dark-purple' | 'system'

export interface ThemeColors {
  text: string
  textMuted: string
  background: string
  backgroundSecondary: string
  border: string
  link: string
  linkHover: string
  codeBackground: string
  codeText: string
  blockquoteBorder: string
  blockquoteBackground: string
  tableHeaderBackground: string
  tableRowHover: string
  headingAnchor: string
}

export interface ThemeConfig {
  name?: string
  colors: ThemeColors
  code?: string
}

// ---------------------------------------------------------------------------
// Plugin system types
// ---------------------------------------------------------------------------

export type RemarkPlugin = () => (tree: unknown, vfile: unknown) => void | Promise<void>
export type RehypePlugin = () => (tree: unknown, vfile: unknown) => void | Promise<void>

export interface MarkdownPlugin {
  name: string
  remarkPlugin?: RemarkPlugin
  rehypePlugin?: RehypePlugin
  components?: Partial<MarkdownComponents>
  defaultOptions?: Record<string, unknown>
  priority?: number
}

// ---------------------------------------------------------------------------
// Serialized markdown (for RSC pattern)
// ---------------------------------------------------------------------------

export interface SerializedMarkdown {
  ast: unknown
  frontmatter: Record<string, unknown> | null
  toc: TOCItem[]
}

// ---------------------------------------------------------------------------
// Internal context value
// ---------------------------------------------------------------------------

export interface MarkdownContextValue {
  options: Required<
    Pick<
      MarkdownOptions,
      'gfm' | 'frontmatter' | 'headingAnchors' | 'highlight' | 'sanitize' | 'lineNumbers'
    >
  > &
    Omit<MarkdownOptions, 'gfm' | 'frontmatter' | 'headingAnchors' | 'highlight' | 'sanitize' | 'lineNumbers'>
  components: MarkdownComponents
  theme: ThemeName | ThemeConfig
}
