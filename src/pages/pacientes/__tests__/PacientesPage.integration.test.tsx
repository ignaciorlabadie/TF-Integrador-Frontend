import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { PacientesPage } from '../PacientesPage'
import { server } from '../../../test/mocks/server'

function renderPage() {
    return render(
        <MemoryRouter>
            <PacientesPage />
        </MemoryRouter>,
    )
}

describe('PacientesPage', () => {
    it('carga y muestra pacientes', async () => {
        renderPage()
        expect(screen.getByText('Cargando pacientes...')).toBeInTheDocument()
        expect(await screen.findByText('Ana')).toBeInTheDocument()
        expect(screen.getByText('Pérez')).toBeInTheDocument()
        expect(screen.getByText('ana@test.com')).toBeInTheDocument()
    })

    it('filtra por nombre, apellido, dni o email', async () => {
        const user = userEvent.setup()
        renderPage()
        await screen.findByText('Ana')

        const input = screen.getByLabelText('Buscar pacientes')
        await user.type(input, 'Juan')
        expect(screen.getByText('Gómez')).toBeInTheDocument()
        expect(screen.queryByText('Pérez')).not.toBeInTheDocument()

        await user.clear(input)
        await user.type(input, '12345678')
        expect(screen.getByText('Pérez')).toBeInTheDocument()
        expect(screen.queryByText('Gómez')).not.toBeInTheDocument()
    })

    it('pagina resultados cuando hay más de 10', async () => {
        const muchos = Array.from({ length: 12 }, (_, i) => ({
            id: i + 1,
            usuarioId: i + 1,
            nombre: `Nombre${i + 1}`,
            apellido: `Apellido${i + 1}`,
            dni: `${10000000 + i}`,
            telefono: '123',
            fechaNacimiento: '1990-01-01',
            direccion: 'Dir',
            createdAt: '2026-01-01T00:00:00Z',
            updatedAt: '2026-01-01T00:00:00Z',
            usuario: {
                id: i + 1,
                email: `p${i + 1}@test.com`,
                rol: 'PACIENTE',
                activo: true,
            },
        }))
        server.use(http.get('*/pacientes', () => HttpResponse.json(muchos)))

        const user = userEvent.setup()
        renderPage()
        await screen.findByText('Nombre1')
        expect(
            screen.getByText(/Mostrando 1 - 10 de 12 resultados/),
        ).toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: 'Siguiente' }))
        expect(await screen.findByText('Nombre11')).toBeInTheDocument()
    })

    it('muestra error y estados vacíos', async () => {
        server.use(
            http.get('*/pacientes', () =>
                HttpResponse.json({ mensaje: 'Error carga' }, { status: 500 }),
            ),
        )
        renderPage()
        expect(await screen.findByRole('alert')).toHaveTextContent(
            'Error carga',
        )
    })

    it('muestra mensaje cuando no hay pacientes', async () => {
        server.use(http.get('*/pacientes', () => HttpResponse.json([])))
        renderPage()
        expect(
            await screen.findByText('No hay pacientes registrados.'),
        ).toBeInTheDocument()
    })
})
