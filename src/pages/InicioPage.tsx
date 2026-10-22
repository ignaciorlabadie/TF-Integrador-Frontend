import { obtenerUsuarioGuardado } from '../services/authService'

export function InicioPage() {
    const usuario = obtenerUsuarioGuardado()

    return (
        <main>
            <h1>Sistema de Turnos</h1>
            <p>Bienvenido/a{usuario ? `, ${usuario.email}` : ''}.</p>
            {usuario && <p>Rol: {usuario.rol}</p>}
        </main>
    )
}
