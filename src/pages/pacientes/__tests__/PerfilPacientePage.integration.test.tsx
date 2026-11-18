import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import PerfilPacientePage from '../PerfilPacientePage'
import { server } from '../../../test/mocks/server'

function renderPage() {
    return render(
        <MemoryRouter>
            <PerfilPacientePage />
        </MemoryRouter>,
    )
}

describe('PerfilPacientePage', () => {
    it('carga el perfil del paciente', async () => {
        renderPage()
        expect(screen.getByText('Cargando perfil...')).toBeInTheDocument()
        expect(await screen.findByLabelText('Nombre')).toHaveValue('Ana')
        expect(screen.getByLabelText('Apellido')).toHaveValue('Pérez')
        expect(screen.getByLabelText('DNI')).toHaveValue('12345678')
    })

    it('guarda cambios y muestra mensaje de éxito', async () => {
        let receivedBody: Record<string, unknown> = {}
        server.use(
            http.put('*/pacientes/me', async ({ request }) => {
                const body = (await request.json()) as Record<string, unknown>
                receivedBody = body
                return HttpResponse.json({
                    id: 10,
                    usuarioId: 3,
                    nombre: body.nombre,
                    apellido: body.apellido,
                    dni: body.dni,
                    telefono: body.telefono,
                    fechaNacimiento: body.fechaNacimiento,
                    direccion: body.direccion,
                    createdAt: '2026-01-01T00:00:00Z',
                    updatedAt: '2026-01-01T00:00:00Z',
                })
            }),
        )

        const user = userEvent.setup()
        renderPage()
        const nombre = await screen.findByLabelText('Nombre')
        await user.clear(nombre)
        await user.type(nombre, 'Ana Editada')
        await user.click(
            screen.getByRole('button', { name: 'Guardar cambios' }),
        )

        expect(
            await screen.findByText('Perfil actualizado correctamente.'),
        ).toBeInTheDocument()
        expect(receivedBody.nombre).toBe('Ana Editada')
    })

    it('muestra error cuando falla la carga', async () => {
        server.use(
            http.get('*/pacientes/me', () =>
                HttpResponse.json({ mensaje: 'fail' }, { status: 500 }),
            ),
        )
        renderPage()
        expect(
            await screen.findByText(
                'No se pudo cargar el perfil del paciente.',
            ),
        ).toBeInTheDocument()
    })

    it('muestra error cuando falla el guardado', async () => {
        server.use(
            http.put('*/pacientes/me', () =>
                HttpResponse.json({ mensaje: 'fail' }, { status: 500 }),
            ),
        )
        const user = userEvent.setup()
        renderPage()
        await screen.findByLabelText('Nombre')
        await user.click(
            screen.getByRole('button', { name: 'Guardar cambios' }),
        )
        expect(
            await screen.findByText('No se pudo actualizar el perfil.'),
        ).toBeInTheDocument()
    })
})
