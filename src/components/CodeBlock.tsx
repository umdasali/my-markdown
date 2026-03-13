import { memo, useEffect, useState } from 'react'
import type { Highlighter } from 'shiki'
import { clsx } from 'clsx'
import type { PreProps } from '../core/types'
import { useMarkdownContext } from '../core/context'
import { CopyButton } from './CopyButton'
import { detectLanguage } from '../utils/detect-language'

interface CodeBlockProps extends PreProps {
  'data-language'?: string
  'data-raw'?: string
  [key: string]: unknown
}

function CodeBlockComponent({ children, className, 'data-language': lang, 'data-raw': rawCode, ...rest }: CodeBlockProps) {
  const { options } = useMarkdownContext()
  const highlightOptions = typeof options.highlight === 'object' ? options.highlight : {}
  const showCopyButton = options.highlight !== false && (highlightOptions.showCopyButton !== false)
  const showLangLabel = highlightOptions.showLanguageLabel !== false
  const lineNumbers = options.lineNumbers ?? false

  const language = detectLanguage(lang)
  const codeText = rawCode ?? extractText(children)

  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null)

  useEffect(() => {
    if (options.highlight === false) {
      setHighlightedHtml(null)
      return
    }

    let cancelled = false

    const theme = highlightOptions.theme ?? 'github-dark'
    const lightTheme = highlightOptions.themes?.light ?? 'github-light'
    const darkTheme = highlightOptions.themes?.dark ?? 'github-dark'
    const hasDualTheme = !!highlightOptions.themes

    getHighlighter().then((highlighter) => {
      if (cancelled) return
      try {
        const html = hasDualTheme
          ? highlighter.codeToHtml(codeText, {
              lang: language,
              themes: { light: lightTheme, dark: darkTheme },
            })
          : highlighter.codeToHtml(codeText, { lang: language, theme })
        setHighlightedHtml(html)
      } catch {
        setHighlightedHtml(null)
      }
    }).catch(() => {
      if (!cancelled) setHighlightedHtml(null)
    })

    return () => {
      cancelled = true
    }
  }, [codeText, language, options.highlight, highlightOptions.theme, highlightOptions.themes])

  return (
    <div
      className={clsx(
        'mdkit-code-block',
        lineNumbers && 'mdkit-code-block--line-numbers',
        className,
      )}
      data-language={language}
    >
      <div className="mdkit-code-header">
        {showLangLabel && language !== 'text' && (
          <span className="mdkit-code-language" aria-hidden="true">
            {language}
          </span>
        )}
        {showCopyButton && codeText && (
          <CopyButton text={codeText} className="mdkit-code-copy" />
        )}
      </div>

      {highlightedHtml ? (
        <div
          className="mdkit-code-highlighted"
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      ) : (
        <pre className={clsx('mdkit-pre', rest.className as string)} {...rest}>
          {children}
        </pre>
      )}
    </div>
  )
}

export const CodeBlock = memo(CodeBlockComponent)

// ---------------------------------------------------------------------------
// Shiki singleton
// ---------------------------------------------------------------------------

let highlighterPromise: Promise<Highlighter> | null = null

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = import('shiki').then(({ createHighlighter }) =>
      createHighlighter({
        themes: [
          'github-light',
          'github-dark',
          'dracula',
          'one-dark-pro',
          'vitesse-light',
          'vitesse-dark',
          'catppuccin-latte',
          'catppuccin-mocha',
        ],
        langs: [], // loaded on demand
      }),
    )
  }
  return highlighterPromise
}

// ---------------------------------------------------------------------------
// Helper: extract plain text from React children
// ---------------------------------------------------------------------------

function extractText(children: React.ReactNode): string {
  if (typeof children === 'string') return children
  if (typeof children === 'number') return String(children)
  if (Array.isArray(children)) return children.map(extractText).join('')
  if (children && typeof children === 'object' && 'props' in (children as object)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return extractText((children as React.ReactElement).props.children as React.ReactNode)
  }
  return ''
}
