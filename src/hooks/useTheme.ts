import { useState, useEffect, useCallback } from 'react'

export type ResolvedTheme = 'light' | 'dark'
export type ThemePreference = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'mdkit-theme'

export interface UseThemeReturn {
  theme: ResolvedTheme
  preference: ThemePreference
  setTheme: (theme: ThemePreference) => void
}

export function useTheme(): UseThemeReturn {
  const [preference, setPreference] = useState<ThemePreference>(() => {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
    }
    return 'system'
  })

  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    return 'light'
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => setSystemTheme(e.matches ? 'dark' : 'light')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const theme: ResolvedTheme = preference === 'system' ? systemTheme : preference

  const setTheme = useCallback((next: ThemePreference) => {
    setPreference(next)
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, next)
    }
  }, [])

  return { theme, preference, setTheme }
}
