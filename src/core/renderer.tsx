/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MarkdownComponents } from './types'

type ComponentsMap = Record<string, React.ComponentType<Record<string, unknown>>>

/**
 * Convert our MarkdownComponents map to the format expected by hast-util-to-jsx-runtime.
 * Maps HAST element names to React components with proper prop transformation.
 */
export function rehypeReactComponents(components: MarkdownComponents): ComponentsMap {
  const map: ComponentsMap = {}

  // Headings — inject level prop
  if (components.h1) {
    const H1 = components.h1
    map['h1'] = (props) => <H1 {...(props as any)} level={1} />
  }
  if (components.h2) {
    const H2 = components.h2
    map['h2'] = (props) => <H2 {...(props as any)} level={2} />
  }
  if (components.h3) {
    const H3 = components.h3
    map['h3'] = (props) => <H3 {...(props as any)} level={3} />
  }
  if (components.h4) {
    const H4 = components.h4
    map['h4'] = (props) => <H4 {...(props as any)} level={4} />
  }
  if (components.h5) {
    const H5 = components.h5
    map['h5'] = (props) => <H5 {...(props as any)} level={5} />
  }
  if (components.h6) {
    const H6 = components.h6
    map['h6'] = (props) => <H6 {...(props as any)} level={6} />
  }

  // Direct pass-throughs
  const passThrough = [
    'p', 'a', 'img', 'pre', 'table', 'thead', 'tbody',
    'tr', 'th', 'td', 'blockquote', 'ul', 'ol', 'li',
    'hr', 'strong', 'em', 'del',
  ] as const

  for (const tag of passThrough) {
    const comp = components[tag as keyof MarkdownComponents]
    if (comp) {
      map[tag] = comp as ComponentsMap[string]
    }
  }

  // Inline code — detect by absence of newlines in className
  if (components.code) {
    const CodeComp = components.code
    map['code'] = (props) => {
      const isInline = !String(props.className ?? '').includes('language-')
      return <CodeComp {...(props as any)} inline={isInline} />
    }
  }

  return map
}
