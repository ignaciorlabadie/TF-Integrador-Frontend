import type { AxiosResponse } from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../api'
import {
    eliminarPaciente,
    listarPacientes,
    modificarMiPerfil,
    modificarPaciente,
    obtenerMiPerfil,
    obtenerPacientePorId,
    registrarPaciente,
} from '../pacienteService'

vi.mock('../api', () => ({
    api: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}))

const mockedApi = vi.mocked(api)

function response<T>(data: T): AxiosResponse<T> {
    return { data } as AxiosResponse<T>
}

const pacienteBase = {
    id: 1,
    usuarioId: 10,
    nombre: 'Ana',
    apellido: 'Pérez',
    dni: '12345678',
    telefono: '123456789',
    fechaNacimiento: '1990-01-01',
    direccion: 'Calle 1',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
}

describe('pacienteService', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('obtenerMiPerfil hace GET /pacientes/me', async () => {
        mockedApi.get.mockResolvedValue(response(pacienteBase))
        await expect(obtenerMiPerfil()).resolves.toEqual(pacienteBase)
        expect(mockedApi.get).toHaveBeenCalledWith('/pacientes/me')
    })

    it('modificarMiPerfil hace PUT /pacientes/me con payload', async () => {
        const payload = { nombre: 'Ana Maria' }
        const data = { ...pacienteBase, ...payload }
        mockedApi.put.mockResolvedValue(response(data))

        await expect(modificarMiPerfil(payload)).resolves.toEqual(data)
        expect(mockedApi.put).toHaveBeenCalledWith('/pacientes/me', payload)
    })

    it('registrarPaciente hace POST /pacientes con payload', async () => {
        const payload = {
            email: 'nuevo@test.com',
            password: 'secret123',
            nombre: 'Ana',
            apellido: 'Pérez',
            dni: '12345678',
            telefono: '123456789',
            fechaNacimiento: '1990-01-01',
            direccion: 'Calle 1',
        }
        mockedApi.post.mockResolvedValue(
            response({ ...pacienteBase, ...payload, id: 20 }),
        )

        await expect(registrarPaciente(payload)).resolves.toMatchObject({
            id: 20,
        })
        expect(mockedApi.post).toHaveBeenCalledWith('/pacientes', payload)
    })

    it('listarPacientes hace GET /pacientes', async () => {
        const data = [pacienteBase]
        mockedApi.get.mockResolvedValue(response(data))
        await expect(listarPacientes()).resolves.toEqual(data)
        expect(mockedApi.get).toHaveBeenCalledWith('/pacientes')
    })

    it('obtenerPacientePorId hace GET /pacientes/:id', async () => {
        mockedApi.get.mockResolvedValue(response(pacienteBase))
        await expect(obtenerPacientePorId(1)).resolves.toEqual(pacienteBase)
        expect(mockedApi.get).toHaveBeenCalledWith('/pacientes/1')
    })

    it('modificarPaciente hace PUT /pacientes/:id con payload', async () => {
        const payload = { telefono: '999' }
        const data = { ...pacienteBase, ...payload }
        mockedApi.put.mockResolvedValue(response(data))

        await expect(modificarPaciente(1, payload)).resolves.toEqual(data)
        expect(mockedApi.put).toHaveBeenCalledWith('/pacientes/1', payload)
    })

    it('eliminarPaciente hace DELETE /pacientes/:id', async () => {
        mockedApi.delete.mockResolvedValue(response(undefined))
        await expect(eliminarPaciente(1)).resolves.toBeUndefined()
        expect(mockedApi.delete).toHaveBeenCalledWith('/pacientes/1')
    })
})
