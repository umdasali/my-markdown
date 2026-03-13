import { memo } from 'react'
import { clsx } from 'clsx'
import type { ListItemProps } from '../core/types'

function TaskListItemComponent({ children, className, checked }: ListItemProps) {
  const isTask = checked !== null && checked !== undefined

  if (isTask) {
    return (
      <li className={clsx('mdkit-task-item', className)}>
        <input
          type="checkbox"
          checked={checked === true}
          disabled
          aria-label={checked ? 'Completed task' : 'Incomplete task'}
          className="mdkit-task-checkbox"
          readOnly
        />
        <span className="mdkit-task-content">{children}</span>
      </li>
    )
  }

  return <li className={clsx('mdkit-list-item', className)}>{children}</li>
}

export const TaskListItem = memo(TaskListItemComponent)
