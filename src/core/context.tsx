import { createContext, useContext, type ReactNode } from 'react'
import type { MarkdownContextValue, MarkdownOptions, MarkdownComponents } from './types'
import { DEFAULT_COMPONENTS } from '../components/index'
import { mergeComponents } from '../utils/merge-components'

const DEFAULT_OPTIONS: MarkdownContextValue['options'] = {
  gfm: true,
  frontmatter: false,
  headingAnchors: true,
  highlight: true,
  sanitize: true,
  lineNumbers: false,
}

const DEFAULT_CONTEXT: MarkdownContextValue = {
  options: DEFAULT_OPTIONS,
  components: DEFAULT_COMPONENTS,
  theme: 'light',
}

export const MarkdownContext = createContext<MarkdownContextValue>(DEFAULT_CONTEXT)

export interface MarkdownProviderProps {
  children: ReactNode
  options?: MarkdownOptions
  components?: Partial<MarkdownComponents>
  theme?: MarkdownContextValue['theme']
  pluginComponents?: Partial<MarkdownComponents>
}

export function MarkdownProvider({
  children,
  options = {},
  components,
  theme = 'light',
  pluginComponents,
}: MarkdownProviderProps) {
  const {
    gfm = true,
    frontmatter = false,
    headingAnchors = true,
    highlight = true,
    sanitize = true,
    lineNumbers = false,
    ...rest
  } = options

  const mergedOptions: MarkdownContextValue['options'] = {
    gfm,
    frontmatter,
    headingAnchors,
    highlight,
    sanitize,
    lineNumbers,
    ...rest,
  }

  const mergedComponents = mergeComponents(DEFAULT_COMPONENTS, pluginComponents, components)

  return (
    <MarkdownContext.Provider value={{ options: mergedOptions, components: mergedComponents, theme }}>
      {children}
    </MarkdownContext.Provider>
  )
}

export function useMarkdownContext(): MarkdownContextValue {
  return useContext(MarkdownContext)
}
