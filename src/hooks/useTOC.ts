import { useState, useEffect, useCallback } from 'react'
import type { TOCItem } from '../core/types'

export interface UseTOCReturn {
  activeId: string | null
  scrollToHeading: (id: string) => void
}

/**
 * Track the currently visible heading using IntersectionObserver.
 */
export function useTOC(items: TOCItem[], observe = true): UseTOCReturn {
  const [activeId, setActiveId] = useState<string | null>(null)

  const flatIds = flattenTOC(items).map((i) => i.id)

  useEffect(() => {
    if (!observe || flatIds.length === 0) return
    if (typeof IntersectionObserver === 'undefined') return

    const headingElements = flatIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (headingElements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost visible heading
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible.length > 0 && visible[0]) {
          setActiveId(visible[0].target.id)
        }
      },
      {
        rootMargin: '0px 0px -80% 0px',
        threshold: 0,
      },
    )

    headingElements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flatIds.join(','), observe])

  const scrollToHeading = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveId(id)
    }
  }, [])

  return { activeId, scrollToHeading }
}

function flattenTOC(items: TOCItem[]): TOCItem[] {
  return items.flatMap((item) => [item, ...flattenTOC(item.children)])
}
