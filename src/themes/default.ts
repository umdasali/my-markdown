import type { ThemeConfig } from '../core/types'

export const lightTheme: ThemeConfig = {
  name: 'light',
  code: 'github-light',
  colors: {
    text: '#1a1a1a',
    textMuted: '#6b7280',
    background: '#ffffff',
    backgroundSecondary: '#f9fafb',
    border: '#e5e7eb',
    link: '#2563eb',
    linkHover: '#1d4ed8',
    codeBackground: '#f3f4f6',
    codeText: '#1f2937',
    blockquoteBorder: '#d1d5db',
    blockquoteBackground: '#f9fafb',
    tableHeaderBackground: '#f3f4f6',
    tableRowHover: '#f9fafb',
    headingAnchor: '#9ca3af',
  },
}

export const darkTheme: ThemeConfig = {
  name: 'dark',
  code: 'github-dark',
  colors: {
    text: '#f3f4f6',
    textMuted: '#9ca3af',
    background: '#111827',
    backgroundSecondary: '#1f2937',
    border: '#374151',
    link: '#60a5fa',
    linkHover: '#93c5fd',
    codeBackground: '#1f2937',
    codeText: '#f3f4f6',
    blockquoteBorder: '#4b5563',
    blockquoteBackground: '#1f2937',
    tableHeaderBackground: '#1f2937',
    tableRowHover: '#1f2937',
    headingAnchor: '#6b7280',
  },
}

export const githubTheme: ThemeConfig = {
  name: 'github',
  code: 'github-light',
  colors: {
    text: '#24292e',
    textMuted: '#586069',
    background: '#ffffff',
    backgroundSecondary: '#f6f8fa',
    border: '#e1e4e8',
    link: '#0366d6',
    linkHover: '#0255b3',
    codeBackground: '#f6f8fa',
    codeText: '#24292e',
    blockquoteBorder: '#dfe2e5',
    blockquoteBackground: 'transparent',
    tableHeaderBackground: '#f6f8fa',
    tableRowHover: '#f6f8fa',
    headingAnchor: '#bbb',
  },
}

export const draculaTheme: ThemeConfig = {
  name: 'dracula',
  code: 'dracula',
  colors: {
    text: '#f8f8f2',
    textMuted: '#6272a4',
    background: '#282a36',
    backgroundSecondary: '#21222c',
    border: '#44475a',
    link: '#8be9fd',
    linkHover: '#6ad7fb',
    codeBackground: '#21222c',
    codeText: '#f8f8f2',
    blockquoteBorder: '#6272a4',
    blockquoteBackground: '#21222c',
    tableHeaderBackground: '#21222c',
    tableRowHover: '#44475a',
    headingAnchor: '#6272a4',
  },
}
