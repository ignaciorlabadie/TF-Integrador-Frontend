import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { DetalleUsuarioPage } from '../DetalleUsuarioPage'
import { server } from '../../../test/mocks/server'

function renderPage(id = '1') {
    return render(
        <MemoryRouter initialEntries={[`/usuarios/${id}`]}>
            <Routes>
                <Route path="/usuarios/:id" element={<DetalleUsuarioPage />} />
                <Route path="/usuarios" element={<div>Listado usuarios</div>} />
            </Routes>
        </MemoryRouter>,
    )
}

describe('DetalleUsuarioPage', () => {
    it('carga el usuario y permite actualizar datos', async () => {
        let receivedBody: Record<string, unknown> = {}
        server.use(
            http.put('*/usuarios/:id', async ({ params, request }) => {
                const body = (await request.json()) as Record<string, unknown>
                receivedBody = body
                return HttpResponse.json({
                    id: Number(params.id),
                    email: body.email,
                    rol: 'ADMIN',
                    activo: body.activo,
                })
            }),
        )

        const user = userEvent.setup()
        renderPage('1')

        const emailInput = await screen.findByLabelText('Email')
        expect(emailInput).toHaveValue('admin@test.com')
        expect(screen.getByLabelText('Rol')).toHaveValue('ADMIN')

        await user.clear(emailInput)
        await user.type(emailInput, 'editado@test.com')
        await user.click(
            screen.getByRole('button', { name: 'Guardar cambios' }),
        )

        expect(
            await screen.findByText('Usuario actualizado correctamente.'),
        ).toBeInTheDocument()
        expect(receivedBody).toEqual({
            email: 'editado@test.com',
            activo: true,
        })
    })

    it('incluye la contraseña solo si se ingresa', async () => {
        let receivedBody: Record<string, unknown> = {}
        server.use(
            http.put('*/usuarios/:id', async ({ params, request }) => {
                const body = (await request.json()) as Record<string, unknown>
                receivedBody = body
                return HttpResponse.json({
                    id: Number(params.id),
                    email: body.email,
                    rol: 'ADMIN',
                    activo: body.activo,
                })
            }),
        )

        const user = userEvent.setup()
        renderPage('1')
        await screen.findByLabelText('Email')

        await user.type(screen.getByLabelText('Nueva contraseña'), 'nuevapass1')
        await user.click(
            screen.getByRole('button', { name: 'Guardar cambios' }),
        )

        await screen.findByText('Usuario actualizado correctamente.')
        expect(receivedBody).toMatchObject({ password: 'nuevapass1' })
        await waitFor(() =>
            expect(screen.getByLabelText('Nueva contraseña')).toHaveValue(''),
        )
    })

    it('cambia el estado del usuario', async () => {
        const user = userEvent.setup()
        renderPage('1')
        await screen.findByLabelText('Email')

        await user.click(screen.getByRole('button', { name: 'Desactivar' }))
        expect(
            await screen.findByText('Usuario desactivado correctamente.'),
        ).toBeInTheDocument()
        expect(
            screen.getByRole('button', { name: 'Reactivar' }),
        ).toBeInTheDocument()
    })

    it('muestra error si no se puede cargar', async () => {
        server.use(
            http.get('*/usuarios/:id', () =>
                HttpResponse.json({ mensaje: 'No existe' }, { status: 404 }),
            ),
        )
        renderPage('999')

        expect(await screen.findByText('No existe')).toBeInTheDocument()
        expect(screen.getByText('Volver a usuarios')).toBeInTheDocument()
    })
})
