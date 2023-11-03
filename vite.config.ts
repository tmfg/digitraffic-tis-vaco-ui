/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import pluginChecker from 'vite-plugin-checker'
import { configDefaults } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr(), pluginChecker({ typescript: true })],
  base: '/ui',
  preview: {
    port: 5173
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/vitestSetup.ts',
    // you might want to disable it, if you don't have tests that rely on CSS since parsing CSS is slow
    css: true,
    // Exclude doesn't work without specifying this '...configDefaults.exclude' :old-man-yells-at-cloud:
    // And exclude had to be used in the first place because vitest can't deal with Playwright tests out of the box
    exclude: [...configDefaults.exclude, 'src/test/e2e/tests/*']
  }
})
