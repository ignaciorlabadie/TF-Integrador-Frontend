export type Rol = 'PACIENTE' | 'PROFESIONAL' | 'ADMIN'

export interface Usuario {
    id: number
    email: string
    rol: Rol
    activo: boolean
    createdAt?: string
    updatedAt?: string
}

export interface RespuestaLogin {
    token: string
    usuario: Usuario
}

export interface CrearUsuario {
    email: string
    password: string
    rol: Rol
    activo?: boolean
}

export interface ActualizarUsuario {
    email?: string
    password?: string
    activo?: boolean
}
