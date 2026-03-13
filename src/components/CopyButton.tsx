import { memo } from 'react'
import { clsx } from 'clsx'
import { useCopyCode } from '../hooks/useCopyCode'

export interface CopyButtonProps {
  text: string
  className?: string
  copyLabel?: string
  copiedLabel?: string
}

function CopyButtonComponent({
  text,
  className,
  copyLabel = 'Copy code',
  copiedLabel = 'Copied!',
}: CopyButtonProps) {
  const { copied, copy } = useCopyCode(text)

  return (
    <button
      type="button"
      onClick={copy}
      className={clsx('mdkit-copy-btn', copied && 'mdkit-copy-btn--copied', className)}
      aria-label={copied ? copiedLabel : copyLabel}
      title={copied ? copiedLabel : copyLabel}
    >
      {copied ? (
        <svg
          className="mdkit-copy-icon"
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg
          className="mdkit-copy-icon"
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
      <span className="mdkit-copy-label">{copied ? copiedLabel : copyLabel}</span>
    </button>
  )
}

export const CopyButton = memo(CopyButtonComponent)
