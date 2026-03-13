const EXTENSION_MAP: Record<string, string> = {
  js: 'javascript',
  mjs: 'javascript',
  cjs: 'javascript',
  ts: 'typescript',
  tsx: 'tsx',
  jsx: 'jsx',
  py: 'python',
  rb: 'ruby',
  rs: 'rust',
  go: 'go',
  java: 'java',
  cpp: 'cpp',
  c: 'c',
  cs: 'csharp',
  php: 'php',
  swift: 'swift',
  kt: 'kotlin',
  sh: 'bash',
  bash: 'bash',
  zsh: 'bash',
  yaml: 'yaml',
  yml: 'yaml',
  json: 'json',
  md: 'markdown',
  mdx: 'mdx',
  html: 'html',
  css: 'css',
  scss: 'scss',
  sass: 'sass',
  sql: 'sql',
  graphql: 'graphql',
  gql: 'graphql',
  dockerfile: 'dockerfile',
  toml: 'toml',
  xml: 'xml',
  r: 'r',
  lua: 'lua',
  haskell: 'haskell',
  hs: 'haskell',
  scala: 'scala',
  clj: 'clojure',
  ex: 'elixir',
  exs: 'elixir',
  erl: 'erlang',
  dart: 'dart',
  vue: 'vue',
  svelte: 'svelte',
}

/**
 * Normalize a language hint from a fenced code block.
 * Returns a shiki-compatible language name.
 */
export function detectLanguage(hint: string | undefined, fallback = 'text'): string {
  if (!hint) return fallback
  const normalized = hint.toLowerCase().trim()
  return EXTENSION_MAP[normalized] ?? normalized
}
