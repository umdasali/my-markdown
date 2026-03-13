import { unified, type Processor } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import type { MarkdownOptions, MarkdownPlugin, TOCItem } from './types'
import { extractTOC } from '../toc/extractor'

export interface ParseResult {
  processor: Processor
  frontmatter: Record<string, unknown> | null
  toc: TOCItem[]
}

/**
 * Build a unified processor from the given options and plugins.
 * The returned processor converts markdown string → HAST (HTML AST).
 */
export async function buildProcessor(options: MarkdownOptions = {}): Promise<ParseResult> {
  const {
    gfm = true,
    frontmatter: enableFrontmatter = false,
    math = false,
    mermaid: _mermaid = false,
    headingAnchors = true,
    sanitize = true,
    plugins: userPlugins = [],
  } = options

  // Use `any` to bypass unified's complex Processor generic narrowing on each .use() call
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let processor: any = unified().use(remarkParse)

  const frontmatterData: Record<string, unknown> = {}
  let tocItems: TOCItem[] = []

  // --- GFM ---
  if (gfm) {
    const { default: remarkGfm } = await import('remark-gfm')
    processor = processor.use(remarkGfm)
  }

  // --- Frontmatter ---
  if (enableFrontmatter) {
    const { default: remarkFrontmatter } = await import('remark-frontmatter')
    const { default: remarkExtractFrontmatter } = await import('../plugins/builtin/frontmatter')
    processor = processor
      .use(remarkFrontmatter, ['yaml', 'toml'])
      .use(remarkExtractFrontmatter, { data: frontmatterData })
  }

  // --- Math ---
  if (math) {
    const { default: remarkMath } = await import('remark-math')
    processor = processor.use(remarkMath)
  }

  // --- User remark plugins ---
  const sortedPlugins = sortPlugins(userPlugins)
  for (const plugin of sortedPlugins) {
    if (plugin.remarkPlugin) {
      processor = processor.use(plugin.remarkPlugin as never)
    }
  }

  // --- TOC extraction (before remark-rehype) ---
  const tocOptions = options.toc
  if (tocOptions) {
    const maxDepth = typeof tocOptions === 'object' ? (tocOptions.maxDepth ?? 3) : 3
    processor = processor.use(() => (tree: unknown) => {
      // Mutate in-place so the returned array reference stays valid after processing
      const items = extractTOC(tree as never, maxDepth)
      tocItems.splice(0, tocItems.length, ...items)
    })
  }

  // --- remark → rehype ---
  processor = processor.use(remarkRehype, { allowDangerousHtml: true })

  // --- Heading anchors ---
  if (headingAnchors) {
    const { default: rehypeSlug } = await import('rehype-slug')
    const { default: rehypeAutolinkHeadings } = await import('rehype-autolink-headings')
    const anchorOptions = typeof headingAnchors === 'object' ? headingAnchors : {}
    processor = processor.use(rehypeSlug).use(rehypeAutolinkHeadings, {
      behavior: 'wrap',
      properties: {
        className: anchorOptions.className ?? 'mdkit-heading-anchor',
        ariaLabel: anchorOptions.ariaLabel ?? 'Permalink to this heading',
      },
    })
  }

  // --- Math → KaTeX ---
  if (math) {
    const mathOptions = typeof math === 'object' ? math : {}
    const { default: rehypeKatex } = await import('rehype-katex')
    processor = processor.use(rehypeKatex, {
      throwOnError: mathOptions.throwOnError ?? false,
      macros: mathOptions.macros ?? {},
    })
  }

  // --- User rehype plugins ---
  for (const plugin of sortedPlugins) {
    if (plugin.rehypePlugin) {
      processor = processor.use(plugin.rehypePlugin as never)
    }
  }

  // --- Sanitize ---
  if (sanitize !== false) {
    const { buildSanitizeSchema } = await import('../plugins/builtin/sanitize')
    const { default: rehypeSanitize } = await import('rehype-sanitize')
    const sanitizeOptions = typeof sanitize === 'object' ? sanitize : {}
    processor = processor.use(rehypeSanitize, buildSanitizeSchema(sanitizeOptions))
  }

  // --- Stringify (required for processor.process() to work) ---
  const { default: rehypeStringify } = await import('rehype-stringify')
  processor = processor.use(rehypeStringify, { allowDangerousHtml: true })

  return { processor: processor as Processor, frontmatter: frontmatterData, toc: tocItems }
}

function sortPlugins(plugins: MarkdownPlugin[]): MarkdownPlugin[] {
  return [...plugins].sort((a, b) => (a.priority ?? 50) - (b.priority ?? 50))
}
