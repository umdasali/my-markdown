'use client'

import { memo, useEffect, useRef, useState } from 'react'
import { clsx } from 'clsx'
import { useMarkdownContext } from '../core/context'

export interface MermaidProps {
  code: string
  className?: string
}

let mermaidId = 0

function MermaidComponent({ code, className }: MermaidProps) {
  const { options } = useMarkdownContext()
  const mermaidOptions = typeof options.mermaid === 'object' ? options.mermaid : {}
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    import('mermaid')
      .then(({ default: mermaid }) => {
        if (cancelled) return

        mermaid.initialize({
          startOnLoad: false,
          theme: mermaidOptions.theme ?? 'default',
          securityLevel: mermaidOptions.securityLevel ?? 'strict',
          ...(mermaidOptions.fontFamily ? { fontFamily: mermaidOptions.fontFamily } : {}),
        })

        const id = `mdkit-mermaid-${++mermaidId}`

        return mermaid.render(id, code)
      })
      .then((result) => {
        if (!cancelled && result) setSvg(result.svg)
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to render diagram')
        }
      })

    return () => {
      cancelled = true
    }
  }, [code, mermaidOptions.theme, mermaidOptions.securityLevel, mermaidOptions.fontFamily])

  if (error) {
    return (
      <div className={clsx('mdkit-mermaid-error', className)}>
        <p className="mdkit-mermaid-error-msg">Failed to render diagram</p>
        <pre className="mdkit-mermaid-fallback">{code}</pre>
      </div>
    )
  }

  if (!svg) {
    return (
      <div
        className={clsx('mdkit-mermaid-loading', className)}
        aria-label="Loading diagram"
        aria-busy="true"
      >
        <div className="mdkit-mermaid-skeleton" />
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={clsx('mdkit-mermaid', className)}
      role="img"
      aria-label="Mermaid diagram"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

export const Mermaid = memo(MermaidComponent)
