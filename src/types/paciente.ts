import type { Usuario } from './usuario'

export interface Paciente {
    id: number
    usuarioId: number
    nombre: string
    apellido: string
    dni: string
    telefono: string
    fechaNacimiento: string
    direccion: string
    createdAt: string
    updatedAt: string
    usuario?: Usuario
}

export interface CrearPaciente {
    email: string
    password: string
    nombre: string
    apellido: string
    dni: string
    telefono: string
    fechaNacimiento: string
    direccion: string
}

export interface ActualizarPaciente {
    nombre?: string
    apellido?: string
    dni?: string
    telefono?: string
    fechaNacimiento?: string
    direccion?: string
}
