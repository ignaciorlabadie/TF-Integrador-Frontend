import { useEffect, useState } from 'react'
import { obtenerPerfil } from '../../services/authService'
import { modificarUsuario } from '../../services/usuarioService'
import type { ActualizarUsuario, Usuario } from '../../types/usuario'
import { obtenerMensajeError } from '../../utils/errores'

export function MiCuentaPage() {
    const [usuario, setUsuario] = useState<Usuario | null>(null)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [mensaje, setMensaje] = useState('')
    const [cargando, setCargando] = useState(true)
    const [guardando, setGuardando] = useState(false)

    useEffect(() => {
        async function cargarCuenta() {
            try {
                const datos = await obtenerPerfil()
                setUsuario(datos)
                setEmail(datos.email)
                localStorage.setItem('usuario', JSON.stringify(datos))
            } catch (error) {
                setError(
                    obtenerMensajeError(error, 'No se pudo cargar la cuenta.'),
                )
            } finally {
                setCargando(false)
            }
        }

        cargarCuenta()
    }, [])

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!usuario) return

        const datos: ActualizarUsuario = {}

        if (email !== usuario.email) {
            datos.email = email
        }

        if (password) {
            datos.password = password
        }

        setError('')
        setMensaje('')

        if (datos.email === undefined && datos.password === undefined) {
            setMensaje('No hay cambios para guardar.')
            return
        }

        setGuardando(true)

        try {
            const actualizado = await modificarUsuario(usuario.id, datos)
            setUsuario(actualizado)
            setEmail(actualizado.email)
            setPassword('')
            localStorage.setItem('usuario', JSON.stringify(actualizado))
            setMensaje('Cuenta actualizada correctamente.')
        } catch (error) {
            setError(
                obtenerMensajeError(error, 'No se pudo actualizar la cuenta.'),
            )
        } finally {
            setGuardando(false)
        }
    }

    if (cargando) {
        return <p>Cargando cuenta...</p>
    }

    if (!usuario) {
        return <p className="mensaje-error">{error}</p>
    }

    return (
        <main>
            <h1>Mi cuenta</h1>

            <p>
                Rol: {usuario.rol} · Estado:{' '}
                {usuario.activo ? 'Activo' : 'Inactivo'}
            </p>

            <form onSubmit={handleSubmit}>
                <label>
                    Email
                    <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
                </label>

                <label>
                    Nueva contraseña
                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        minLength={8}
                        maxLength={72}
                        placeholder="Dejar vacío para no cambiarla"
                    />
                </label>

                {error && (
                    <p role="alert" className="mensaje-error">
                        {error}
                    </p>
                )}

                {mensaje && <p className="mensaje-exito">{mensaje}</p>}

                <button type="submit" disabled={guardando}>
                    {guardando ? 'Guardando...' : 'Guardar cambios'}
                </button>
            </form>
        </main>
    )
}
