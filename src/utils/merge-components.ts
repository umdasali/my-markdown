import type { MarkdownComponents } from '../core/types'

/**
 * Merge multiple component maps. Later maps take precedence over earlier ones.
 */
export function mergeComponents(
  ...maps: Array<Partial<MarkdownComponents> | undefined>
): MarkdownComponents {
  return Object.assign({}, ...maps.filter(Boolean)) as MarkdownComponents
}
