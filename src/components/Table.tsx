import { memo } from 'react'
import { clsx } from 'clsx'
import type { TableProps } from '../core/types'

function TableComponent({ children, className }: TableProps) {
  return (
    <div className="mdkit-table-wrapper" role="region" aria-label="Table" tabIndex={0}>
      <table className={clsx('mdkit-table', className)} role="table">
        {children}
      </table>
    </div>
  )
}

export const Table = memo(TableComponent)
