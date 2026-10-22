import { api } from './api'
import type { ActualizarUsuario, CrearUsuario, Usuario } from '../types/usuario'

export async function listarUsuarios(): Promise<Usuario[]> {
    const respuesta = await api.get<Usuario[]>('/usuarios')
    return respuesta.data
}

export async function obtenerUsuarioPorId(id: number): Promise<Usuario> {
    const respuesta = await api.get<Usuario>(`/usuarios/${id}`)
    return respuesta.data
}

export async function buscarUsuarioPorEmail(email: string): Promise<Usuario> {
    const respuesta = await api.get<Usuario>(
        `/usuarios/email/${encodeURIComponent(email)}`,
    )

    return respuesta.data
}

export async function crearUsuario(datos: CrearUsuario): Promise<Usuario> {
    const respuesta = await api.post<Usuario>('/usuarios', datos)
    return respuesta.data
}

export async function modificarUsuario(
    id: number,
    datos: ActualizarUsuario,
): Promise<Usuario> {
    const respuesta = await api.put<Usuario>(`/usuarios/${id}`, datos)
    return respuesta.data
}

export async function desactivarUsuario(id: number): Promise<Usuario> {
    const respuesta = await api.patch<Usuario>(`/usuarios/${id}/desactivar`)
    return respuesta.data
}

export async function reactivarUsuario(id: number): Promise<Usuario> {
    const respuesta = await api.patch<Usuario>(`/usuarios/${id}/reactivar`)
    return respuesta.data
}
