export type Rol = 'PACIENTE' | 'PROFESIONAL' | 'ADMIN'

export interface Usuario {
    id: number
    email: string
    rol: Rol
    activo: boolean
}

export interface RespuestaLogin {
    token: string
    usuario: Usuario
}
