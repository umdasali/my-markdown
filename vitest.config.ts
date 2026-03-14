import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 80,
        branches: 75,
        functions: 80,
        statements: 80,
      },
      exclude: [
        'node_modules/**',
        'dist/**',
        'tests/**',
        'examples/**',
        '**/*.config.*',
        '**/*.d.ts',
      ],
    },
  },
  resolve: {
    alias: {
      'react-markdown-ziri': '/src/index.ts',
      'react-markdown-ziri/server': '/src/server/index.ts',
      'react-markdown-ziri/toc': '/src/toc/index.ts',
      'react-markdown-ziri/themes': '/src/themes/index.ts',
    },
  },
})
