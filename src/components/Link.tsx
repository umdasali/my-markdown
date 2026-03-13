import { memo } from 'react'
import { clsx } from 'clsx'
import type { LinkProps } from '../core/types'
import { useMarkdownContext } from '../core/context'
import { isExternalUrl } from '../utils/is-external-url'

function LinkComponent({ href = '#', children, className, title, target, rel }: LinkProps) {
  const { options } = useMarkdownContext()
  const external = isExternalUrl(href)
  const extOptions = options.externalLinks ?? {}

  const resolvedTarget = target ?? (external ? (extOptions.target ?? '_blank') : undefined)
  const resolvedRel =
    rel ??
    (external
      ? (extOptions.rel ?? 'noopener noreferrer')
      : undefined)

  const extraAriaLabel =
    external && extOptions.newTabAriaLabel
      ? `, ${extOptions.newTabAriaLabel}`
      : external
        ? ', opens in new tab'
        : undefined

  return (
    <a
      href={href}
      className={clsx('mdkit-link', external && 'mdkit-link--external', className)}
      title={title}
      target={resolvedTarget}
      rel={resolvedRel}
      aria-label={typeof children === 'string' && extraAriaLabel ? `${children}${extraAriaLabel}` : undefined}
    >
      {children}
      {external && extOptions.icon && (
        <span className="mdkit-link-icon" aria-hidden="true">
          {extOptions.icon}
        </span>
      )}
    </a>
  )
}

export const Link = memo(LinkComponent)
