import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import type { Rol } from '../types/usuario'
import { obtenerUsuarioGuardado } from '../services/authService'

interface Props {
    roles: Rol[]
    children: ReactNode
}

export function RutaPorRol({ roles, children }: Props) {
    const usuario = obtenerUsuarioGuardado()

    if (!usuario) {
        return <Navigate to="/login" replace />
    }

    if (!roles.includes(usuario.rol)) {
        return <Navigate to="/" replace />
    }

    return children
}
