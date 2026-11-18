import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { RegistroPacientePage } from '../RegistroPacientePage'
import { server } from '../../../test/mocks/server'

function renderPage() {
    return render(
        <MemoryRouter initialEntries={['/registro']}>
            <Routes>
                <Route path="/registro" element={<RegistroPacientePage />} />
                <Route path="/login" element={<div>Pantalla login</div>} />
            </Routes>
        </MemoryRouter>,
    )
}

describe('RegistroPacientePage', () => {
    it('registra un paciente y navega a login', async () => {
        let receivedBody: Record<string, unknown> = {}
        server.use(
            http.post('*/pacientes', async ({ request }) => {
                receivedBody = (await request.json()) as Record<string, unknown>
                return HttpResponse.json(
                    { id: 1, ...receivedBody },
                    { status: 201 },
                )
            }),
        )

        const user = userEvent.setup()
        renderPage()

        await user.type(screen.getByLabelText('Email'), 'nuevo@paciente.com')
        await user.type(screen.getByLabelText('Contraseña'), 'password123')
        await user.type(screen.getByLabelText('Nombre'), 'Nuevo')
        await user.type(screen.getByLabelText('Apellido'), 'Paciente')
        await user.type(screen.getByLabelText('DNI'), '11222333')
        await user.type(screen.getByLabelText('Teléfono'), '123456789')
        await user.type(
            screen.getByLabelText('Fecha de nacimiento'),
            '1995-02-03',
        )
        await user.type(screen.getByLabelText('Dirección'), 'Calle Falsa 123')

        await user.click(screen.getByRole('button', { name: 'Crear cuenta' }))

        expect(await screen.findByText('Pantalla login')).toBeInTheDocument()
        expect(receivedBody).toMatchObject({
            email: 'nuevo@paciente.com',
            password: 'password123',
            nombre: 'Nuevo',
            apellido: 'Paciente',
            dni: '11222333',
            telefono: '123456789',
            fechaNacimiento: '1995-02-03',
            direccion: 'Calle Falsa 123',
        })
    })

    it('muestra error cuando falla el registro', async () => {
        server.use(
            http.post('*/pacientes', () =>
                HttpResponse.json(
                    { mensaje: 'DNI duplicado' },
                    { status: 400 },
                ),
            ),
        )

        const user = userEvent.setup()
        renderPage()

        await user.type(screen.getByLabelText('Email'), 'nuevo@paciente.com')
        await user.type(screen.getByLabelText('Contraseña'), 'password123')
        await user.type(screen.getByLabelText('Nombre'), 'Nuevo')
        await user.type(screen.getByLabelText('Apellido'), 'Paciente')
        await user.type(screen.getByLabelText('DNI'), '11222333')
        await user.type(screen.getByLabelText('Teléfono'), '123456789')
        await user.type(
            screen.getByLabelText('Fecha de nacimiento'),
            '1995-02-03',
        )
        await user.type(screen.getByLabelText('Dirección'), 'Calle Falsa 123')
        await user.click(screen.getByRole('button', { name: 'Crear cuenta' }))

        expect(await screen.findByRole('alert')).toHaveTextContent(
            'DNI duplicado',
        )
    })
})
