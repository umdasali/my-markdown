export { lightTheme, darkTheme, githubTheme, draculaTheme } from './default'
export type { ThemeConfig, ThemeColors, ThemeName } from '../core/types'

import type { ThemeName, ThemeConfig } from '../core/types'
import { lightTheme, darkTheme, githubTheme, draculaTheme } from './default'

const THEMES: Record<Exclude<ThemeName, 'system'>, ThemeConfig> = {
  light: lightTheme,
  dark: darkTheme,
  github: githubTheme,
  dracula: draculaTheme,
}

export function getTheme(name: ThemeName | ThemeConfig): ThemeConfig {
  if (typeof name === 'object') return name
  if (name === 'system') {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return darkTheme
    }
    return lightTheme
  }
  return THEMES[name] ?? lightTheme
}

/**
 * Convert a ThemeConfig to CSS custom properties string.
 * Useful for injecting themes via <style> tags.
 */
export function themeToCSS(theme: ThemeConfig, selector = ':root'): string {
  const { colors } = theme
  const vars = Object.entries(colors)
    .map(([key, value]) => `  --mdkit-${camelToKebab(key)}: ${value};`)
    .join('\n')

  return `${selector} {\n${vars}\n}`
}

function camelToKebab(str: string): string {
  return str.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`)
}
