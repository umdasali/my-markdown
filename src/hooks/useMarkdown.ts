/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import { useState, useEffect, useMemo } from 'react'
import type { ReactNode } from 'react'
import type { MarkdownOptions, TOCItem, MarkdownComponents } from '../core/types'
import { buildProcessor } from '../core/parser'
import { rehypeReactComponents } from '../core/renderer'
import { mergeComponents } from '../utils/merge-components'
import { DEFAULT_COMPONENTS } from '../components/index'

export interface UseMarkdownOptions extends MarkdownOptions {
  components?: Partial<MarkdownComponents>
}

export interface UseMarkdownReturn {
  content: ReactNode
  frontmatter: Record<string, unknown> | null
  toc: TOCItem[]
  isLoading: boolean
  error: Error | null
}

/**
 * Client-side hook that processes a markdown string into React nodes.
 * Uses async unified pipeline with memoization.
 */
export function useMarkdown(source: string, options: UseMarkdownOptions = {}): UseMarkdownReturn {
  const [content, setContent] = useState<ReactNode>(null)
  const [frontmatter, setFrontmatter] = useState<Record<string, unknown> | null>(null)
  const [toc, setToc] = useState<TOCItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const { components, ...markdownOptions } = options
  // Stable serialized keys — used as memo deps instead of unstable object references
  const componentsKey = JSON.stringify(components)
  const optionsKey = JSON.stringify(markdownOptions)

  const mergedComponents = useMemo(
    () => mergeComponents(DEFAULT_COMPONENTS, components),
    [componentsKey], // stable string dep, not the object reference
  )

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    buildProcessor(markdownOptions)
      .then(async ({ processor, frontmatter: fm, toc: tocItems }) => {
        // Use parse() + run() to get the HAST tree directly (before stringify)
        const mdast = processor.parse(source)
        const hast = await processor.run(mdast)

        if (cancelled) return

        // Convert HAST to React nodes
        const { toJsxRuntime } = await import('hast-util-to-jsx-runtime')
        const { Fragment, jsx, jsxs } = await import('react/jsx-runtime')

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const node = toJsxRuntime(hast as any, {
          Fragment,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          jsx: jsx as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          jsxs: jsxs as any,
          components: rehypeReactComponents(mergedComponents),
        })

        setContent(node)
        setFrontmatter(fm && Object.keys(fm).length > 0 ? fm : null)
        setToc(tocItems)
        setIsLoading(false)
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Failed to process markdown'))
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [source, optionsKey]) // stable string dep avoids re-running on every render

  return { content, frontmatter, toc, isLoading, error }
}
