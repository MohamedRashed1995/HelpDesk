<<<<<<< HEAD
import { defineConfig } from 'vitest/config'
=======
import { defineConfig } from 'vite'
>>>>>>> 95f43248261b9ce82ba6995324a329dbf0cdcc27
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
<<<<<<< HEAD
  plugins: [react(), tailwindcss() as any],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
  },
=======
  plugins: [react(), tailwindcss()],
>>>>>>> 95f43248261b9ce82ba6995324a329dbf0cdcc27
})
