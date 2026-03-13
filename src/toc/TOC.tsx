import { memo } from 'react'
import { clsx } from 'clsx'
import type { TOCItem } from '../core/types'
import { TOCItemComponent } from './TOCItem'
import { useTOC } from '../hooks/useTOC'

export interface TOCProps {
  items: TOCItem[]
  maxDepth?: 1 | 2 | 3 | 4 | 5 | 6
  className?: string
  itemClassName?: string
  activeClassName?: string
  onItemClick?: (item: TOCItem) => void
  ordered?: boolean
  title?: React.ReactNode
  observeScroll?: boolean
}

function TOCComponent({
  items,
  maxDepth = 3,
  className,
  itemClassName,
  activeClassName,
  onItemClick,
  ordered = false,
  title,
  observeScroll = true,
}: TOCProps) {
  const { activeId, scrollToHeading } = useTOC(items, observeScroll)

  if (items.length === 0) return null

  const ListTag = ordered ? 'ol' : 'ul'

  const handleItemClick = (item: TOCItem) => {
    scrollToHeading(item.id)
    onItemClick?.(item)
  }

  return (
    <nav className={clsx('mdkit-toc', className)} aria-label="Table of contents">
      {title && <div className="mdkit-toc-title">{title}</div>}
      <ListTag className="mdkit-toc-list">
        {items.map((item) => (
          <TOCItemComponent
            key={item.id}
            item={item}
            activeId={activeId}
            maxDepth={maxDepth}
            {...(activeClassName !== undefined ? { activeClassName } : {})}
            {...(itemClassName !== undefined ? { itemClassName } : {})}
            onItemClick={handleItemClick}
          />
        ))}
      </ListTag>
    </nav>
  )
}

export const TOC = memo(TOCComponent)
