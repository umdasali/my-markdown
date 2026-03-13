import { defineConfig } from 'tsup'

export default defineConfig([
  // Client bundle — main entry
  {
    entry: { index: 'src/index.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    splitting: true,
    treeshake: true,
    clean: true,
    external: ['react', 'react-dom', 'next', 'katex', 'mermaid'],
    esbuildOptions(options) {
      options.banner = {
        js: '"use client";',
      }
    },
  },
  // Server bundle — Next.js RSC, no "use client"
  {
    entry: { 'server/index': 'src/server/index.ts' },
    format: ['esm'],
    dts: true,
    sourcemap: true,
    splitting: false,
    treeshake: true,
    external: ['react', 'react-dom', 'next', 'katex', 'mermaid'],
  },
  // TOC subpath export
  {
    entry: { 'toc/index': 'src/toc/index.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    external: ['react', 'react-dom'],
  },
  // Themes subpath export
  {
    entry: { 'themes/index': 'src/themes/index.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    external: ['react'],
  },
])
