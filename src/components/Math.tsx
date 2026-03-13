import { memo } from 'react'
import { clsx } from 'clsx'

export interface MathProps {
  value: string
  inline?: boolean
  className?: string
}

function MathComponent({ value, inline = false, className }: MathProps) {
  // This component renders KaTeX HTML output
  // The actual rendering is handled by rehype-katex in the pipeline
  // This is a fallback display for when KaTeX is not installed
  const Tag = inline ? 'span' : 'div'

  return (
    <Tag
      className={clsx('mdkit-math', inline ? 'mdkit-math--inline' : 'mdkit-math--block', className)}
      role="math"
      aria-label={value}
    />
  )
}

export const Math = memo(MathComponent)
