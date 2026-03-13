import { memo } from 'react'
import { clsx } from 'clsx'
import type { HeadingProps } from '../core/types'
import { useMarkdownContext } from '../core/context'

const TAG = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const

function HeadingComponent({ id, level, children, className }: HeadingProps) {
  const { options } = useMarkdownContext()
  const Tag = TAG[level - 1] as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

  const anchorEnabled = !!options.headingAnchors
  const anchorOptions = typeof options.headingAnchors === 'object' ? options.headingAnchors : {}
  const position = anchorOptions.position ?? 'before'

  const anchor =
    anchorEnabled && id ? (
      <a
        href={`#${id}`}
        className={clsx('mdkit-anchor', anchorOptions.className)}
        aria-hidden="true"
        tabIndex={-1}
      >
        {anchorOptions.icon ?? '#'}
      </a>
    ) : null

  return (
    <Tag id={id} className={clsx('mdkit-heading', `mdkit-h${level}`, className)}>
      {position === 'before' && anchor}
      {children}
      {position === 'after' && anchor}
    </Tag>
  )
}

export const Heading = memo(HeadingComponent)

// Convenience wrappers for each level
export const H1 = (props: Omit<HeadingProps, 'level'>) => <Heading {...props} level={1} />
export const H2 = (props: Omit<HeadingProps, 'level'>) => <Heading {...props} level={2} />
export const H3 = (props: Omit<HeadingProps, 'level'>) => <Heading {...props} level={3} />
export const H4 = (props: Omit<HeadingProps, 'level'>) => <Heading {...props} level={4} />
export const H5 = (props: Omit<HeadingProps, 'level'>) => <Heading {...props} level={5} />
export const H6 = (props: Omit<HeadingProps, 'level'>) => <Heading {...props} level={6} />
