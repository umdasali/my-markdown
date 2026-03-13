import { useState, useCallback } from 'react'

export interface UseCopyCodeReturn {
  copied: boolean
  copy: () => void
}

export function useCopyCode(text: string, resetDelay = 2000): UseCopyCodeReturn {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(() => {
    if (!navigator.clipboard) {
      // Fallback for older browsers
      try {
        const el = document.createElement('textarea')
        el.value = text
        el.style.position = 'fixed'
        el.style.opacity = '0'
        document.body.appendChild(el)
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
        setCopied(true)
        setTimeout(() => setCopied(false), resetDelay)
      } catch {
        // silent fail
      }
      return
    }

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), resetDelay)
    }).catch(() => {
      // silent fail
    })
  }, [text, resetDelay])

  return { copied, copy }
}
