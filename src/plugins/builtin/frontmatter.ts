import type { Plugin } from 'unified'
import type { Root, YAML } from 'mdast'
import { load as loadYaml } from 'js-yaml'
import { visit } from 'unist-util-visit'

interface ExtractFrontmatterOptions {
  data: Record<string, unknown>
}

/**
 * Remark plugin that extracts YAML frontmatter into the provided `data` object.
 * Works in tandem with remark-frontmatter.
 */
const remarkExtractFrontmatter: Plugin<[ExtractFrontmatterOptions], Root> = ({ data }) => {
  return (tree) => {
    visit(tree, 'yaml', (node: YAML) => {
      try {
        const parsed = loadYaml(node.value)
        if (parsed && typeof parsed === 'object') {
          Object.assign(data, parsed)
        }
      } catch {
        // Ignore invalid YAML
      }
    })
  }
}

export default remarkExtractFrontmatter
