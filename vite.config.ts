import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ Final working config for Netlify deployment
export default defineConfig({
  plugins: [react()],
  base: '', // do NOT use './' here, use empty string
  build: {
    outDir: 'dist',
  },
})

