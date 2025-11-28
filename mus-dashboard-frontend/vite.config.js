// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    visualizer({
      filename: 'stats.html',
      template: 'treemap', // atau 'sunburst'
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  server: {
    proxy: {
      // Memastikan panggilan ke "/api" di dev diarahkan ke backend lokal
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
