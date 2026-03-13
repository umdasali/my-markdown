import { memo, useState } from 'react'
import { clsx } from 'clsx'
import type { ImageProps } from '../core/types'
import { useMarkdownContext } from '../core/context'

function ImageComponent({ src = '', alt, title, width, height, className }: ImageProps) {
  const { options } = useMarkdownContext()
  const imgOptions = options.images ?? {}
  const [error, setError] = useState(false)

  const resolvedAlt = alt ?? src.split('/').pop()?.split('.')[0] ?? 'image'
  const lazyLoad = imgOptions.lazyLoad !== false

  const imgElement = (
    <img
      src={error ? '' : src}
      alt={resolvedAlt}
      title={title}
      width={width}
      height={height}
      loading={lazyLoad ? 'lazy' : undefined}
      decoding="async"
      className={clsx('mdkit-image', className)}
      onError={() => setError(true)}
    />
  )

  if (title) {
    return (
      <figure className="mdkit-figure">
        {imgElement}
        <figcaption className="mdkit-figcaption">{title}</figcaption>
      </figure>
    )
  }

  return imgElement
}

export const Image = memo(ImageComponent)
