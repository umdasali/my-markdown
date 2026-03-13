import type { Root, Heading, PhrasingContent } from 'mdast'
import { visit } from 'unist-util-visit'
import type { TOCItem } from '../core/types'
import { slugify } from '../utils/slugify'

function extractHeadingText(nodes: PhrasingContent[]): string {
  return nodes
    .map((node) => {
      if (node.type === 'text') return node.value
      if ('children' in node) return extractHeadingText(node.children)
      return ''
    })
    .join('')
}

/**
 * Walk the MDAST and collect headings up to maxDepth.
 * Returns a nested tree of TOCItems.
 */
export function extractTOC(tree: Root, maxDepth: number = 3): TOCItem[] {
  const flatItems: TOCItem[] = []

  visit(tree, 'heading', (node: Heading) => {
    if (node.depth > maxDepth) return

    const text = extractHeadingText(node.children)
    const id = slugify(text)

    flatItems.push({
      id,
      text,
      level: node.depth,
      children: [],
    })
  })

  return buildTree(flatItems)
}

function buildTree(items: TOCItem[]): TOCItem[] {
  const root: TOCItem[] = []
  const stack: TOCItem[] = []

  for (const item of items) {
    while (stack.length > 0 && (stack[stack.length - 1]?.level ?? 0) >= item.level) {
      stack.pop()
    }

    if (stack.length === 0) {
      root.push(item)
    } else {
      stack[stack.length - 1]!.children.push(item)
    }

    stack.push(item)
  }

  return root
}
