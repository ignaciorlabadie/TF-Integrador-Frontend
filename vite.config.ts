import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './src/setupTests.ts',
        css: true,
        env: {
            VITE_API_URL: 'http://localhost:3000',
        },
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
        },
    },
})
