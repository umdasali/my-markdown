'use client'

// ── Core ──────────────────────────────────────────────────────────────────
export { Markdown } from './core/Markdown'
export type { MarkdownProps } from './core/types'

// ── Context ───────────────────────────────────────────────────────────────
export { MarkdownProvider, useMarkdownContext } from './core/context'
export type { MarkdownProviderProps } from './core/context'

// ── Components ────────────────────────────────────────────────────────────
export {
  Heading,
  H1, H2, H3, H4, H5, H6,
  Link,
  Image,
  Table,
  TaskListItem,
  CodeBlock,
  CopyButton,
  Math,
  Mermaid,
} from './components/index'

export type { CopyButtonProps } from './components/CopyButton'
export type { MathProps } from './components/Math'
export type { MermaidProps } from './components/Mermaid'

// ── Hooks ─────────────────────────────────────────────────────────────────
export { useMarkdown } from './hooks/useMarkdown'
export type { UseMarkdownReturn, UseMarkdownOptions } from './hooks/useMarkdown'

export { useTOC } from './hooks/useTOC'
export type { UseTOCReturn } from './hooks/useTOC'

export { useCopyCode } from './hooks/useCopyCode'
export type { UseCopyCodeReturn } from './hooks/useCopyCode'

export { useTheme } from './hooks/useTheme'
export type { UseThemeReturn, ThemePreference, ResolvedTheme } from './hooks/useTheme'

// ── Plugin system ─────────────────────────────────────────────────────────
export { createPlugin, composePlugins } from './plugins/index'
export type { MarkdownPlugin, ComposedPlugins } from './plugins/index'

// ── Types (all public types) ───────────────────────────────────────────────
export type {
  MarkdownOptions,
  MarkdownComponents,
  HeadingProps,
  LinkProps,
  ImageProps,
  CodeProps,
  PreProps,
  ListItemProps,
  TableProps,
  TOCItem,
  ThemeName,
  ThemeConfig,
  ThemeColors,
  HeadingAnchorOptions,
  HighlightOptions,
  MathOptions,
  MermaidOptions,
  ExternalLinkOptions,
  ImageOptions,
  SanitizeOptions,
  TOCOptions,
  SerializedMarkdown,
} from './core/types'
