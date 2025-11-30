import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: "/Employee-Attendance-System",
  server: { port: 3000 }
})
