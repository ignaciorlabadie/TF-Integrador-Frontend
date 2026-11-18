import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { DetallePacientePage } from '../DetallePacientePage'
import { server } from '../../../test/mocks/server'

function renderPage(id = '10') {
    return render(
        <MemoryRouter initialEntries={[`/pacientes/${id}`]}>
            <Routes>
                <Route
                    path="/pacientes/:id"
                    element={<DetallePacientePage />}
                />
                <Route
                    path="/pacientes"
                    element={<div>Listado pacientes</div>}
                />
            </Routes>
        </MemoryRouter>,
    )
}

describe('DetallePacientePage', () => {
    it('carga y actualiza un paciente', async () => {
        let receivedBody: Record<string, unknown> = {}
        server.use(
            http.put('*/pacientes/:id', async ({ params, request }) => {
                const body = (await request.json()) as Record<string, unknown>
                receivedBody = body
                return HttpResponse.json({
                    id: Number(params.id),
                    usuarioId: 3,
                    nombre: body.nombre,
                    apellido: body.apellido,
                    dni: body.dni,
                    telefono: body.telefono,
                    fechaNacimiento: body.fechaNacimiento,
                    direccion: body.direccion,
                    createdAt: '2026-01-01T00:00:00Z',
                    updatedAt: '2026-01-01T00:00:00Z',
                    usuario: {
                        id: 3,
                        email: 'ana@test.com',
                        rol: 'PACIENTE',
                        activo: true,
                    },
                })
            }),
        )

        const user = userEvent.setup()
        renderPage('10')

        const nombre = await screen.findByLabelText('Nombre')
        expect(nombre).toHaveValue('Ana')
        expect(screen.getByText(/ana@test.com/)).toBeInTheDocument()

        await user.clear(nombre)
        await user.type(nombre, 'Ana Maria')
        await user.click(
            screen.getByRole('button', { name: 'Guardar cambios' }),
        )

        expect(
            await screen.findByText('Paciente actualizado correctamente.'),
        ).toBeInTheDocument()
        expect(receivedBody.nombre).toBe('Ana Maria')
        expect(receivedBody.dni).toBe('12345678')
    })

    it('elimina el paciente cuando se confirma', async () => {
        const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
        let deleted = false
        server.use(
            http.delete('*/pacientes/:id', () => {
                deleted = true
                return new HttpResponse(null, { status: 204 })
            }),
        )

        const user = userEvent.setup()
        renderPage('10')
        await screen.findByLabelText('Nombre')

        await user.click(
            screen.getByRole('button', { name: 'Eliminar paciente' }),
        )

        expect(confirmSpy).toHaveBeenCalled()
        expect(await screen.findByText('Listado pacientes')).toBeInTheDocument()
        expect(deleted).toBe(true)
    })

    it('no elimina si se cancela la confirmación', async () => {
        vi.spyOn(window, 'confirm').mockReturnValue(false)
        let deleted = false
        server.use(
            http.delete('*/pacientes/:id', () => {
                deleted = true
                return new HttpResponse(null, { status: 204 })
            }),
        )

        const user = userEvent.setup()
        renderPage('10')
        await screen.findByLabelText('Nombre')

        await user.click(
            screen.getByRole('button', { name: 'Eliminar paciente' }),
        )
        expect(deleted).toBe(false)
        expect(
            screen.getByRole('heading', { name: /Paciente 10/ }),
        ).toBeInTheDocument()
    })

    it('muestra error si no se puede cargar', async () => {
        server.use(
            http.get('*/pacientes/:id', () =>
                HttpResponse.json({ mensaje: 'No existe' }, { status: 404 }),
            ),
        )
        renderPage('999')
        expect(await screen.findByText('No existe')).toBeInTheDocument()
    })
})
