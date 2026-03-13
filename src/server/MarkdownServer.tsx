/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import type { MarkdownProps, MarkdownComponents, SerializedMarkdown } from '../core/types'
import { buildProcessor } from '../core/parser'
import { rehypeReactComponents } from '../core/renderer'
import { mergeComponents } from '../utils/merge-components'
import { DEFAULT_COMPONENTS } from '../components/index'
import { clsx } from 'clsx'

export interface MarkdownServerProps extends Omit<MarkdownProps, 'onFrontmatter' | 'onTOC'> {
  serialized?: SerializedMarkdown
}

/**
 * React Server Component version of <Markdown>.
 * Runs the full unified pipeline on the server — zero client JS emitted.
 * Syntax highlighting (Shiki) runs server-side for static HTML.
 *
 * Interactive features (copy button, Mermaid) are NOT available in this component.
 * Use the client <Markdown> component for those.
 */
export async function MarkdownServer({
  children,
  serialized,
  components,
  options = {},
  className,
  style,
  'aria-label': ariaLabel,
  id,
}: MarkdownServerProps) {
  const mergedComponents: MarkdownComponents = mergeComponents(DEFAULT_COMPONENTS, components)
  const componentMap = rehypeReactComponents(mergedComponents)

  let content: React.ReactNode

  if (serialized?.ast) {
    // Use pre-serialized AST (from serializeMarkdown)
    const { toJsxRuntime } = await import('hast-util-to-jsx-runtime')
    const { Fragment, jsx, jsxs } = await import('react/jsx-runtime')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content = toJsxRuntime(serialized.ast as any, { Fragment, jsx: jsx as any, jsxs: jsxs as any, components: componentMap })
  } else if (children) {
    // Process markdown string on the server using parse() + run() to get HAST
    const { processor } = await buildProcessor(options)
    const mdast = processor.parse(children)
    const hast = await processor.run(mdast)

    const { toJsxRuntime } = await import('hast-util-to-jsx-runtime')
    const { Fragment, jsx, jsxs } = await import('react/jsx-runtime')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content = toJsxRuntime(hast as any, { Fragment, jsx: jsx as any, jsxs: jsxs as any, components: componentMap })
  }

  return (
    <article
      id={id}
      className={clsx('mdkit-root', className)}
      style={style}
      role="article"
      aria-label={ariaLabel ?? 'Markdown content'}
    >
      {content}
    </article>
  )
}
