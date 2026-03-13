import type { MarkdownPlugin, MarkdownComponents } from '../core/types'
import { mergePluginComponents } from './types'

export interface ComposedPlugins {
  remarkPlugins: NonNullable<MarkdownPlugin['remarkPlugin']>[]
  rehypePlugins: NonNullable<MarkdownPlugin['rehypePlugin']>[]
  components: Partial<MarkdownComponents>
}

/**
 * Sort plugins by priority and extract remark/rehype arrays and merged components.
 */
export function composePlugins(plugins: MarkdownPlugin[]): ComposedPlugins {
  const sorted = [...plugins].sort((a, b) => (a.priority ?? 50) - (b.priority ?? 50))

  return {
    remarkPlugins: sorted
      .filter((p) => p.remarkPlugin !== undefined)
      .map((p) => p.remarkPlugin!),
    rehypePlugins: sorted
      .filter((p) => p.rehypePlugin !== undefined)
      .map((p) => p.rehypePlugin!),
    components: mergePluginComponents(sorted),
  }
}
