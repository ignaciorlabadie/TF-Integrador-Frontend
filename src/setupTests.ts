import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll, vi } from 'vitest'
import { server } from './test/mocks/server'

vi.stubEnv('VITE_API_URL', 'http://localhost:3000/api')

beforeAll(() => {
    server.listen()
})

afterEach(() => {
    server.resetHandlers()
    cleanup()
    localStorage.clear()
    vi.restoreAllMocks()
})

afterAll(() => {
    server.close()
})

Object.defineProperty(window, 'scrollTo', {
    value: vi.fn(),
    writable: true,
})

if (!window.confirm) {
    window.confirm = vi.fn()
}
