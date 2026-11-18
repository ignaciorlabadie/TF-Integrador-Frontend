import { http, HttpResponse } from 'msw'
import { pacientesFixture, usuariosFixture } from './fixtures'

export const handlers = [
    http.get('*/usuarios/email/:email', ({ params }) => {
        const email = decodeURIComponent(String(params.email))
        const usuario = usuariosFixture.find((u) => u.email === email)
        return usuario
            ? HttpResponse.json(usuario)
            : HttpResponse.json({ mensaje: 'No encontrado' }, { status: 404 })
    }),
    http.get('*/usuarios', () => HttpResponse.json(usuariosFixture)),
    http.get('*/usuarios/:id', ({ params }) => {
        const id = Number(params.id)
        const usuario = usuariosFixture.find((u) => u.id === id)
        return usuario
            ? HttpResponse.json(usuario)
            : HttpResponse.json({ mensaje: 'No encontrado' }, { status: 404 })
    }),
    http.post('*/usuarios', async ({ request }) => {
        const body = (await request.json()) as Record<string, unknown>
        return HttpResponse.json(
            { id: 99, activo: true, ...body },
            { status: 201 },
        )
    }),
    http.put('*/usuarios/:id', async ({ params, request }) => {
        const id = Number(params.id)
        const body = (await request.json()) as Record<string, unknown>
        const base = usuariosFixture.find((u) => u.id === id) || {
            id,
            rol: 'PROFESIONAL',
            activo: true,
            email: '',
        }
        return HttpResponse.json({ ...base, ...body, id })
    }),
    http.patch('*/usuarios/:id/desactivar', ({ params }) => {
        const id = Number(params.id)
        const base = usuariosFixture.find((u) => u.id === id) || {
            id,
            rol: 'PROFESIONAL',
            email: '',
            activo: true,
        }
        return HttpResponse.json({ ...base, activo: false })
    }),
    http.patch('*/usuarios/:id/reactivar', ({ params }) => {
        const id = Number(params.id)
        const base = usuariosFixture.find((u) => u.id === id) || {
            id,
            rol: 'PROFESIONAL',
            email: '',
            activo: false,
        }
        return HttpResponse.json({ ...base, activo: true })
    }),

    http.get('*/pacientes', () => HttpResponse.json(pacientesFixture)),
    http.get('*/pacientes/me', () => HttpResponse.json(pacientesFixture[0])),
    http.get('*/pacientes/:id', ({ params }) => {
        const id = Number(params.id)
        const paciente = pacientesFixture.find((p) => p.id === id)
        return paciente
            ? HttpResponse.json(paciente)
            : HttpResponse.json({ mensaje: 'No encontrado' }, { status: 404 })
    }),
    http.post('*/pacientes', async ({ request }) => {
        const body = (await request.json()) as Record<string, unknown>
        return HttpResponse.json({ id: 50, ...body }, { status: 201 })
    }),
    http.put('*/pacientes/me', async ({ request }) => {
        const body = (await request.json()) as Record<string, unknown>
        return HttpResponse.json({ ...pacientesFixture[0], ...body })
    }),
    http.put('*/pacientes/:id', async ({ params, request }) => {
        const id = Number(params.id)
        const body = (await request.json()) as Record<string, unknown>
        const base =
            pacientesFixture.find((p) => p.id === id) || pacientesFixture[0]
        return HttpResponse.json({ ...base, ...body, id })
    }),
    http.delete(
        '*/pacientes/:id',
        () => new HttpResponse(null, { status: 204 }),
    ),
]
