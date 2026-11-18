import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { CrearUsuarioPage } from '../CrearUsuarioPage'
import { server } from '../../../test/mocks/server'

function renderPage() {
    return render(
        <MemoryRouter initialEntries={['/usuarios/nuevo']}>
            <Routes>
                <Route path="/usuarios/nuevo" element={<CrearUsuarioPage />} />
                <Route path="/usuarios" element={<div>Listado usuarios</div>} />
            </Routes>
        </MemoryRouter>,
    )
}

describe('CrearUsuarioPage', () => {
    it('crea un usuario y navega al listado', async () => {
        let receivedBody: Record<string, unknown> = {}
        server.use(
            http.post('*/usuarios', async ({ request }) => {
                receivedBody = (await request.json()) as Record<string, unknown>
                return HttpResponse.json(
                    { id: 1, ...receivedBody },
                    { status: 201 },
                )
            }),
        )

        const user = userEvent.setup()
        renderPage()

        await user.type(screen.getByLabelText('Email'), 'nuevo@test.com')
        await user.type(screen.getByLabelText('Contraseña'), 'password123')
        await user.selectOptions(screen.getByLabelText('Rol'), 'ADMIN')
        await user.click(screen.getByLabelText(/Activo/))

        await user.click(screen.getByRole('button', { name: 'Crear usuario' }))

        expect(await screen.findByText('Listado usuarios')).toBeInTheDocument()
        expect(receivedBody).toMatchObject({
            email: 'nuevo@test.com',
            password: 'password123',
            rol: 'ADMIN',
            activo: false,
        })
    })

    it('muestra error cuando falla la creación', async () => {
        server.use(
            http.post('*/usuarios', () =>
                HttpResponse.json({ mensaje: 'Email en uso' }, { status: 400 }),
            ),
        )

        const user = userEvent.setup()
        renderPage()

        await user.type(screen.getByLabelText('Email'), 'nuevo@test.com')
        await user.type(screen.getByLabelText('Contraseña'), 'password123')
        await user.click(screen.getByRole('button', { name: 'Crear usuario' }))

        expect(await screen.findByRole('alert')).toHaveTextContent(
            'Email en uso',
        )
    })
})
