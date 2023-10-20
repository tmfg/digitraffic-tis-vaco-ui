import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import pluginChecker from 'vite-plugin-checker'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr(), pluginChecker({ typescript: true })],
  base: '/ui',
  preview: {
    port: 5173
  }
})
