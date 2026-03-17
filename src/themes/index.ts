export { lightTheme, darkTheme, githubTheme, draculaTheme, lightGreenTheme, lightOrangeTheme, lightPinkTheme, lightPurpleTheme, darkGreenTheme, darkOrangeTheme, darkPinkTheme, darkPurpleTheme } from './default'
export type { ThemeConfig, ThemeColors, ThemeName } from '../core/types'

import type { ThemeName, ThemeConfig } from '../core/types'
import { lightTheme, darkTheme, githubTheme, draculaTheme, lightGreenTheme, lightOrangeTheme, lightPinkTheme, lightPurpleTheme, darkGreenTheme, darkOrangeTheme, darkPinkTheme, darkPurpleTheme } from './default'

const THEMES: Record<Exclude<ThemeName, 'system'>, ThemeConfig> = {
  light: lightTheme,
  dark: darkTheme,
  github: githubTheme,
  dracula: draculaTheme,
  'light-green': lightGreenTheme,
  'light-orange': lightOrangeTheme,
  'light-pink': lightPinkTheme,
  'light-purple': lightPurpleTheme,
  'dark-green': darkGreenTheme,
  'dark-orange': darkOrangeTheme,
  'dark-pink': darkPinkTheme,
  'dark-purple': darkPurpleTheme,
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

const COLOR_TO_CSS_VAR: Record<string, string> = {
  text: '--mdkit-text',
  textMuted: '--mdkit-text-muted',
  background: '--mdkit-bg',
  backgroundSecondary: '--mdkit-bg-secondary',
  border: '--mdkit-border',
  link: '--mdkit-link',
  linkHover: '--mdkit-link-hover',
  codeBackground: '--mdkit-code-bg',
  codeText: '--mdkit-code-text',
  blockquoteBorder: '--mdkit-blockquote-border',
  blockquoteBackground: '--mdkit-blockquote-bg',
  tableHeaderBackground: '--mdkit-table-header-bg',
  tableRowHover: '--mdkit-table-row-hover',
  headingAnchor: '--mdkit-heading-anchor',
}

/**
 * Convert a ThemeConfig to CSS custom properties string.
 * Useful for injecting themes via <style> tags.
 */
export function themeToCSS(theme: ThemeConfig, selector = ':root'): string {
  const { colors } = theme
  const vars = Object.entries(colors)
    .map(([key, value]) => {
      const cssVar = COLOR_TO_CSS_VAR[key] ?? `--mdkit-${key}`
      return `  ${cssVar}: ${value};`
    })
    .join('\n')

  return `${selector} {\n${vars}\n}`
}
