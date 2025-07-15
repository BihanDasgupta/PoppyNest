import { defineConfig } from 'vite'

export default defineConfig({
  define: {
    'process.env': process.env
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        journal: 'journal.html',
        draw: 'draw.html',
        dreams: 'dreams.html'
      }
    }
  }
})
