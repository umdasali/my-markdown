'use client'

import { memo, useEffect } from 'react'
import { clsx } from 'clsx'
import type { MarkdownProps } from './types'
import { MarkdownProvider, useMarkdownContext } from './context'
import { mergeComponents } from '../utils/merge-components'
import { DEFAULT_COMPONENTS } from '../components/index'
import { useMarkdown } from '../hooks/useMarkdown'

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

  return (
    <article
      id={id}
      className={clsx('mdkit-root', theme === 'dark' && 'mdkit-dark', theme === 'light' && 'mdkit-light', className)}
      style={style}
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
