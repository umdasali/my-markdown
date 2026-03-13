import { defaultSchema } from 'rehype-sanitize'
import type { Options as SanitizeSchema } from 'rehype-sanitize'
import type { SanitizeOptions } from '../../core/types'

/**
 * Build a rehype-sanitize schema from user options.
 * Extends the safe default schema with optional math/mermaid allowances.
 */
export function buildSanitizeSchema(options: Exclude<SanitizeOptions, boolean>): SanitizeSchema {
  const schema: SanitizeSchema = {
    ...defaultSchema,
    attributes: {
      ...defaultSchema.attributes,
      // Allow class on all elements (needed for syntax highlighting, math, etc.)
      '*': [
        ...(defaultSchema.attributes?.['*'] ?? []),
        'className',
        'style',
        'data*',
        'aria*',
        'role',
        'id',
        'tabIndex',
      ],
      code: [...(defaultSchema.attributes?.['code'] ?? []), 'className'],
      pre: [...(defaultSchema.attributes?.['pre'] ?? []), 'className'],
      div: [...(defaultSchema.attributes?.['div'] ?? []), 'className', 'style'],
      span: [...(defaultSchema.attributes?.['span'] ?? []), 'className', 'style'],
      img: [...(defaultSchema.attributes?.['img'] ?? []), 'loading', 'decoding'],
      a: [...(defaultSchema.attributes?.['a'] ?? []), 'target', 'rel', 'className'],
    },
    tagNames: [
      ...(defaultSchema.tagNames ?? []),
      'figure',
      'figcaption',
      'details',
      'summary',
      'mark',
      'ins',
      'kbd',
      'sub',
      'sup',
    ],
  }

  // Allow math-related tags (KaTeX output)
  if (options.allowMath) {
    schema.tagNames = [
      ...(schema.tagNames ?? []),
      'math',
      'mrow',
      'mi',
      'mo',
      'mn',
      'msup',
      'msub',
      'mfrac',
      'mover',
      'munder',
      'msubsup',
      'mtext',
      'annotation',
      'semantics',
      'mspace',
      'mtable',
      'mtr',
      'mtd',
    ]
    schema.attributes = {
      ...schema.attributes,
      math: ['xmlns', 'display', 'className'],
      annotation: ['encoding'],
    }
  }

  // Merge user-provided allowlist
  if (options.allowlist) {
    if (options.allowlist.tagNames) {
      schema.tagNames = [...(schema.tagNames ?? []), ...options.allowlist.tagNames]
    }
    if (options.allowlist.attributes) {
      for (const [tag, attrs] of Object.entries(options.allowlist.attributes)) {
        schema.attributes = {
          ...schema.attributes,
          [tag]: [...(schema.attributes?.[tag] ?? []), ...attrs],
        }
      }
    }
  }

  return schema
}
