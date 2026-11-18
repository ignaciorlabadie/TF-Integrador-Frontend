import type { AxiosResponse } from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../api'
import {
    buscarUsuarioPorEmail,
    crearUsuario,
    desactivarUsuario,
    listarUsuarios,
    modificarUsuario,
    obtenerUsuarioPorId,
    reactivarUsuario,
} from '../usuarioService'

vi.mock('../api', () => ({
    api: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
    },
}))

const mockedApi = vi.mocked(api)

function response<T>(data: T): AxiosResponse<T> {
    return { data } as AxiosResponse<T>
}

describe('usuarioService', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('listarUsuarios hace GET /usuarios y retorna data', async () => {
        const data = [
            { id: 1, email: 'a@a.com', rol: 'ADMIN' as const, activo: true },
        ]
        mockedApi.get.mockResolvedValue(response(data))

        await expect(listarUsuarios()).resolves.toEqual(data)
        expect(mockedApi.get).toHaveBeenCalledWith('/usuarios')
    })

    it('obtenerUsuarioPorId hace GET /usuarios/:id', async () => {
        const data = {
            id: 2,
            email: 'b@b.com',
            rol: 'PROFESIONAL' as const,
            activo: true,
        }
        mockedApi.get.mockResolvedValue(response(data))

        await expect(obtenerUsuarioPorId(2)).resolves.toEqual(data)
        expect(mockedApi.get).toHaveBeenCalledWith('/usuarios/2')
    })

    it('buscarUsuarioPorEmail encodea el email en la URL', async () => {
        const data = {
            id: 3,
            email: 'a+b@test.com',
            rol: 'ADMIN' as const,
            activo: true,
        }
        mockedApi.get.mockResolvedValue(response(data))

        await expect(buscarUsuarioPorEmail('a+b@test.com')).resolves.toEqual(
            data,
        )
        expect(mockedApi.get).toHaveBeenCalledWith(
            `/usuarios/email/${encodeURIComponent('a+b@test.com')}`,
        )
    })

    it('crearUsuario hace POST /usuarios con payload', async () => {
        const payload = {
            email: 'n@test.com',
            password: 'secret123',
            rol: 'PROFESIONAL' as const,
        }
        const data = { id: 10, ...payload, activo: true }
        mockedApi.post.mockResolvedValue(response(data))

        await expect(crearUsuario(payload)).resolves.toEqual(data)
        expect(mockedApi.post).toHaveBeenCalledWith('/usuarios', payload)
    })

    it('modificarUsuario hace PUT /usuarios/:id con payload', async () => {
        const payload = { email: 'edit@test.com', activo: false }
        const data = { id: 5, rol: 'ADMIN' as const, ...payload }
        mockedApi.put.mockResolvedValue(response(data))

        await expect(modificarUsuario(5, payload)).resolves.toEqual(data)
        expect(mockedApi.put).toHaveBeenCalledWith('/usuarios/5', payload)
    })

    it('desactivarUsuario hace PATCH /usuarios/:id/desactivar', async () => {
        const data = {
            id: 6,
            email: 'x@test.com',
            rol: 'ADMIN' as const,
            activo: false,
        }
        mockedApi.patch.mockResolvedValue(response(data))

        await expect(desactivarUsuario(6)).resolves.toEqual(data)
        expect(mockedApi.patch).toHaveBeenCalledWith('/usuarios/6/desactivar')
    })

    it('reactivarUsuario hace PATCH /usuarios/:id/reactivar', async () => {
        const data = {
            id: 7,
            email: 'y@test.com',
            rol: 'ADMIN' as const,
            activo: true,
        }
        mockedApi.patch.mockResolvedValue(response(data))

        await expect(reactivarUsuario(7)).resolves.toEqual(data)
        expect(mockedApi.patch).toHaveBeenCalledWith('/usuarios/7/reactivar')
    })
})
