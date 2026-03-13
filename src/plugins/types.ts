import type { MarkdownPlugin, MarkdownComponents } from '../core/types'

export type { MarkdownPlugin }

/**
 * Factory for creating type-safe markdown plugins.
 */
export function createPlugin(config: MarkdownPlugin): MarkdownPlugin {
  if (!config.name) throw new Error('Plugin must have a name')
  return config
}

/**
 * Merge component maps from multiple plugins.
 * Later plugins take precedence.
 */
export function mergePluginComponents(plugins: MarkdownPlugin[]): Partial<MarkdownComponents> {
  return plugins.reduce<Partial<MarkdownComponents>>(
    (acc, plugin) => ({ ...acc, ...plugin.components }),
    {},
  )
}
