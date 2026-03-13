import type { Plugin } from 'unified'
import type { Root, Code } from 'mdast'
import { visit } from 'unist-util-visit'

/**
 * Remark plugin that converts ```mermaid fenced code blocks
 * into a custom HAST node that the <Mermaid> React component can handle.
 */
const remarkMermaid: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'code', (node: Code, index, parent) => {
      if (node.lang?.toLowerCase() !== 'mermaid') return
      if (!parent || index === undefined) return

      // Replace the code node with a custom HTML node
      // The renderer picks this up via the `pre[data-mermaid]` selector
      parent.children.splice(index, 1, {
        type: 'html',
        value: `<div class="mdkit-mermaid-raw" data-mermaid="${encodeURIComponent(node.value)}"></div>`,
      })
    })
  }
}

export default remarkMermaid
