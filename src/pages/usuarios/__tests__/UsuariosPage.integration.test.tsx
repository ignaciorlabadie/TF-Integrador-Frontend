import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { UsuariosPage } from '../UsuariosPage'
import { server } from '../../../test/mocks/server'

function renderPage() {
    return render(
        <MemoryRouter>
            <UsuariosPage />
        </MemoryRouter>,
    )
}

describe('UsuariosPage', () => {
    it('carga y muestra el listado de usuarios', async () => {
        renderPage()

        expect(screen.getByText('Cargando usuarios...')).toBeInTheDocument()
        expect(await screen.findByText('admin@test.com')).toBeInTheDocument()
        expect(screen.getByText('pro@test.com')).toBeInTheDocument()
        expect(screen.getByText('paciente@test.com')).toBeInTheDocument()
    })

    it('filtra usuarios por email, rol, estado o id', async () => {
        const user = userEvent.setup()
        renderPage()
        await screen.findByText('admin@test.com')

        const input = screen.getByLabelText('Buscar usuarios')
        await user.type(input, 'admin')
        expect(screen.getByText('admin@test.com')).toBeInTheDocument()
        expect(screen.queryByText('pro@test.com')).not.toBeInTheDocument()

        await user.clear(input)
        await user.type(input, 'inactivo')
        expect(screen.getByText('paciente@test.com')).toBeInTheDocument()
        expect(screen.queryByText('admin@test.com')).not.toBeInTheDocument()
    })

    it('pagina los resultados cuando hay más de 10 usuarios', async () => {
        const muchos = Array.from({ length: 12 }, (_, i) => ({
            id: i + 1,
            email: `user${i + 1}@test.com`,
            rol: 'PROFESIONAL' as const,
            activo: true,
        }))
        server.use(http.get('*/usuarios', () => HttpResponse.json(muchos)))

        const user = userEvent.setup()
        renderPage()
        await screen.findByText('user1@test.com')

        expect(
            screen.getByText(/Mostrando 1 - 10 de 12 resultados/),
        ).toBeInTheDocument()
        expect(screen.getByText('Página 1 de 2')).toBeInTheDocument()
        expect(screen.queryByText('user11@test.com')).not.toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: 'Siguiente' }))
        expect(await screen.findByText('user11@test.com')).toBeInTheDocument()
        expect(screen.queryByText('user1@test.com')).not.toBeInTheDocument()
    })

    it('desactiva y reactiva un usuario mostrando mensajes', async () => {
        const user = userEvent.setup()
        renderPage()
        await screen.findByText('admin@test.com')

        const filaAdmin = screen.getByText('admin@test.com').closest('tr')!
        const btnDesactivar = within(filaAdmin).getByRole('button', {
            name: 'Desactivar',
        })
        await user.click(btnDesactivar)

        expect(
            await screen.findByText('Usuario desactivado correctamente.'),
        ).toBeInTheDocument()
        expect(within(filaAdmin).getByText('Inactivo')).toBeInTheDocument()
        expect(
            within(filaAdmin).getByRole('button', { name: 'Reactivar' }),
        ).toBeInTheDocument()

        await user.click(
            within(filaAdmin).getByRole('button', { name: 'Reactivar' }),
        )
        expect(
            await screen.findByText('Usuario reactivado correctamente.'),
        ).toBeInTheDocument()
        expect(within(filaAdmin).getByText('Activo')).toBeInTheDocument()
    })

    it('muestra error cuando falla la carga', async () => {
        server.use(
            http.get('*/usuarios', () =>
                HttpResponse.json({ mensaje: 'Fallo' }, { status: 500 }),
            ),
        )
        renderPage()

        expect(await screen.findByRole('alert')).toHaveTextContent('Fallo')
    })

    it('muestra estado vacío cuando no hay usuarios', async () => {
        server.use(http.get('*/usuarios', () => HttpResponse.json([])))
        renderPage()
        expect(
            await screen.findByText('No hay usuarios registrados.'),
        ).toBeInTheDocument()
    })
})
