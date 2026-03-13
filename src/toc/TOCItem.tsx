import { memo } from 'react'
import { clsx } from 'clsx'
import type { TOCItem as TOCItemType } from '../core/types'

export interface TOCItemProps {
  item: TOCItemType
  activeId?: string | null | undefined
  maxDepth: number
  activeClassName?: string | undefined
  itemClassName?: string | undefined
  onItemClick?: ((item: TOCItemType) => void) | undefined
}

function TOCItemComponent({
  item,
  activeId,
  maxDepth,
  activeClassName,
  itemClassName,
  onItemClick,
}: TOCItemProps) {
  const isActive = item.id === activeId
  const hasChildren = item.children.length > 0 && item.level < maxDepth

  return (
    <li className={clsx('mdkit-toc-item', itemClassName)}>
      <a
        href={`#${item.id}`}
        className={clsx('mdkit-toc-link', isActive && ['mdkit-toc-link--active', activeClassName])}
        aria-current={isActive ? 'location' : undefined}
        onClick={(e) => {
          if (onItemClick) {
            e.preventDefault()
            onItemClick(item)
          }
        }}
      >
        {item.text}
      </a>
      {hasChildren && (
        <ul className="mdkit-toc-sublist">
          {item.children.map((child) => (
            <TOCItemComponent
              key={child.id}
              item={child}
              activeId={activeId}
              maxDepth={maxDepth}
              {...(activeClassName !== undefined ? { activeClassName } : {})}
              {...(itemClassName !== undefined ? { itemClassName } : {})}
              {...(onItemClick !== undefined ? { onItemClick } : {})}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

export const TOCItemComponent_ = memo(TOCItemComponent)
export { TOCItemComponent_ as TOCItemComponent }
