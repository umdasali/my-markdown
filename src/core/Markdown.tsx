'use client'

import { memo, useEffect } from 'react'
import { clsx } from 'clsx'
import type { MarkdownProps, ThemeColors, ThemeConfig } from './types'
import { MarkdownProvider, useMarkdownContext } from './context'
import { mergeComponents } from '../utils/merge-components'
import { DEFAULT_COMPONENTS } from '../components/index'
import { useMarkdown } from '../hooks/useMarkdown'
import { getTheme } from '../themes'

// Explicit mapping from ThemeColors keys to the CSS variable names used in base.css
const COLOR_TO_CSS_VAR: Record<keyof ThemeColors, string> = {
  text: '--mdkit-text',
  textMuted: '--mdkit-text-muted',
  background: '--mdkit-bg',
  backgroundSecondary: '--mdkit-bg-secondary',
  border: '--mdkit-border',
  link: '--mdkit-link',
  linkHover: '--mdkit-link-hover',
  codeBackground: '--mdkit-code-bg',
  codeText: '--mdkit-code-text',
  blockquoteBorder: '--mdkit-blockquote-border',
  blockquoteBackground: '--mdkit-blockquote-bg',
  tableHeaderBackground: '--mdkit-table-header-bg',
  tableRowHover: '--mdkit-table-row-hover',
  headingAnchor: '--mdkit-heading-anchor',
}

function themeToInlineStyle(config: ThemeConfig): Record<string, string> {
  const vars: Record<string, string> = {}
  for (const [key, value] of Object.entries(config.colors)) {
    const cssVar = COLOR_TO_CSS_VAR[key as keyof ThemeColors]
    if (cssVar) vars[cssVar] = value
  }
  return vars
}

function MarkdownInner({
  children,
  className,
  style,
  'aria-label': ariaLabel,
  id,
  onFrontmatter,
  onTOC,
}: MarkdownProps) {
  const { options, components: contextComponents, theme } = useMarkdownContext()

  const { content, frontmatter, toc, isLoading } = useMarkdown(children, {
    ...options,
    components: contextComponents,
  })

  useEffect(() => {
    if (frontmatter) onFrontmatter?.(frontmatter)
  }, [frontmatter, onFrontmatter])

  useEffect(() => {
    if (toc.length > 0) onTOC?.(toc)
  }, [toc, onTOC])

  // system theme: let CSS media queries (base.css) handle it — no inline vars needed
  const themeStyle = theme !== 'system' ? themeToInlineStyle(getTheme(theme)) : {}

  return (
    <article
      id={id}
      className={clsx('mdkit-root', className)}
      style={{ ...themeStyle, ...style }}
      role="article"
      aria-label={ariaLabel ?? 'Markdown content'}
      aria-busy={isLoading}
    >
      {content}
    </article>
  )
}

function MarkdownComponent(props: MarkdownProps) {
  const { components, options, theme } = props
  const mergedComponents = mergeComponents(DEFAULT_COMPONENTS, components)

  return (
    <MarkdownProvider options={options ?? {}} components={mergedComponents} {...(theme !== undefined ? { theme } : {})}>
      <MarkdownInner {...props} />
    </MarkdownProvider>
  )
}

export const Markdown = memo(MarkdownComponent)
