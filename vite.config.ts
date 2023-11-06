/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import pluginChecker from 'vite-plugin-checker'
import { configDefaults } from 'vitest/config'
import istanbul from 'vite-plugin-istanbul'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    pluginChecker({ typescript: true }),
    istanbul({
      include: 'src/*',
      exclude: [
        'node_modules',
        'src/test/*',
        'src/test/e2e/tests/*',
        'src/test/e2e/fixtures/*',
        '**/node_modules/**',
        '**/dist/**',
        'coreui-components/src/**',
        'coreui-css/lib/*',
        'coreui-css/src/*'
      ],
      extension: ['.ts', '.tsx']
      //requireEnv: true
    })
  ],
  base: '/ui',
  preview: {
    port: 5173
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/unit/vitestSetup.ts',
    // you might want to disable it, if you don't have tests that rely on CSS since parsing CSS is slow
    css: true,
    // Exclude doesn't work without specifying this '...configDefaults.exclude' :old-man-yells-at-cloud:
    // And exclude had to be used in the first place because vitest can't deal with Playwright tests out of the box
    // It is possible, but then tests need to be wrapped with describe/test methods provided by vitest
    // and all the perks of Playwright are lost
    exclude: [
      ...configDefaults.exclude,
      'src/test/e2e/tests/*',
      'src/test/e2e/fixtures/*',
      '**/node_modules/**',
      '**/dist/**',
      'coreui-components/src/*',
      'coreui-css/lib/**',
      'coreui-css/src/**'
    ],
    coverage: {
      provider: 'istanbul',
      reporter: ['json'],
      reportsDirectory: './src/test/coverage'
    }
  }
})
