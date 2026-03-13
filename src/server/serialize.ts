import type { MarkdownOptions, SerializedMarkdown, TOCItem } from '../core/types'
import { buildProcessor } from '../core/parser'

/**
 * Pre-process markdown on the server and return a serializable object.
 * Designed for use in Next.js `generateStaticParams` / `getStaticProps`.
 *
 * @example
 * // app/blog/[slug]/page.tsx
 * export async function generateStaticParams() { ... }
 * export default async function Page({ params }) {
 *   const raw = await fs.readFile(`content/${params.slug}.md`, 'utf8')
 *   const serialized = await serializeMarkdown(raw, { frontmatter: true, toc: true })
 *   return <MarkdownServer serialized={serialized} />
 * }
 */
export async function serializeMarkdown(
  content: string,
  options: MarkdownOptions = {},
): Promise<SerializedMarkdown> {
  const { processor, frontmatter, toc } = await buildProcessor(options)
  const file = await processor.process(content)

  return {
    ast: file.result as unknown,
    frontmatter: frontmatter && Object.keys(frontmatter).length > 0 ? frontmatter : null,
    toc: toc as TOCItem[],
  }
}
