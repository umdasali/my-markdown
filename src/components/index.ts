import type { MarkdownComponents } from '../core/types'
import { H1, H2, H3, H4, H5, H6 } from './Heading'
import { Link } from './Link'
import { Image } from './Image'
import { Table } from './Table'
import { TaskListItem } from './TaskListItem'
import { CodeBlock } from './CodeBlock'

export { Heading, H1, H2, H3, H4, H5, H6 } from './Heading'
export { Link } from './Link'
export { Image } from './Image'
export { Table } from './Table'
export { TaskListItem } from './TaskListItem'
export { CodeBlock } from './CodeBlock'
export { CopyButton } from './CopyButton'
export { Math } from './Math'
export { Mermaid } from './Mermaid'

/**
 * Default component map — used when no custom components are provided.
 */
export const DEFAULT_COMPONENTS: MarkdownComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  a: Link,
  img: Image,
  table: Table,
  li: TaskListItem,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pre: CodeBlock as any,
}
