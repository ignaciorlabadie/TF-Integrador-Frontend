import { api } from './api'
import type { Usuario, RespuestaLogin } from '../types/usuario'

export interface Credenciales {
    email: string
    password: string
}

export async function iniciarSesion(
    credenciales: Credenciales,
): Promise<RespuestaLogin> {
    const respuesta = await api.post<RespuestaLogin>(
        '/auth/login',
        credenciales,
    )

    return respuesta.data
}

export async function obtenerPerfil(): Promise<Usuario> {
    const respuesta = await api.get<Usuario>('/auth/me')
    return respuesta.data
}
