import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
    desactivarUsuario,
    modificarUsuario,
    obtenerUsuarioPorId,
    reactivarUsuario,
} from '../../services/usuarioService'
import type { Usuario } from '../../types/usuario'
import { obtenerMensajeError } from '../../utils/errores'

export function DetalleUsuarioPage() {
    const { id } = useParams()
    const usuarioId = Number(id)

    const [usuario, setUsuario] = useState<Usuario | null>(null)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [activo, setActivo] = useState(true)
    const [error, setError] = useState('')
    const [mensaje, setMensaje] = useState('')
    const [cargando, setCargando] = useState(true)
    const [guardando, setGuardando] = useState(false)
    const [procesando, setProcesando] = useState(false)

    useEffect(() => {
        async function cargarUsuario() {
            try {
                const datos = await obtenerUsuarioPorId(usuarioId)
                setUsuario(datos)
                setEmail(datos.email)
                setActivo(datos.activo)
            } catch (error) {
                setError(
                    obtenerMensajeError(error, 'No se pudo cargar el usuario.'),
                )
            } finally {
                setCargando(false)
            }
        }

        cargarUsuario()
    }, [usuarioId])

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!usuario) return

        setError('')
        setMensaje('')
        setGuardando(true)

        try {
            const actualizado = await modificarUsuario(usuario.id, {
                email,
                activo,
                ...(password ? { password } : {}),
            })

            setUsuario(actualizado)
            setEmail(actualizado.email)
            setActivo(actualizado.activo)
            setPassword('')
            setMensaje('Usuario actualizado correctamente.')
        } catch (error) {
            setError(
                obtenerMensajeError(error, 'No se pudo actualizar el usuario.'),
            )
        } finally {
            setGuardando(false)
        }
    }

    async function handleCambiarEstado() {
        if (!usuario) return

        setError('')
        setMensaje('')
        setProcesando(true)

        try {
            const actualizado = usuario.activo
                ? await desactivarUsuario(usuario.id)
                : await reactivarUsuario(usuario.id)

            setUsuario(actualizado)
            setActivo(actualizado.activo)
            setMensaje(
                actualizado.activo
                    ? 'Usuario reactivado correctamente.'
                    : 'Usuario desactivado correctamente.',
            )
        } catch (error) {
            setError(
                obtenerMensajeError(
                    error,
                    'No se pudo cambiar el estado del usuario.',
                ),
            )
        } finally {
            setProcesando(false)
        }
    }

    if (cargando) {
        return <p>Cargando usuario...</p>
    }

    if (!usuario) {
        return (
            <main>
                <p className="mensaje-error">{error}</p>
                <p>
                    <Link to="/usuarios">Volver a usuarios</Link>
                </p>
            </main>
        )
    }

    return (
        <main>
            <h1>Usuario {usuario.id}</h1>

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
                    Rol
                    <input value={usuario.rol} readOnly />
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

                <label>
                    <span>
                        <input
                            type="checkbox"
                            checked={activo}
                            onChange={(event) =>
                                setActivo(event.target.checked)
                            }
                        />{' '}
                        Activo
                    </span>
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

            <p>
                <button
                    type="button"
                    onClick={handleCambiarEstado}
                    disabled={procesando}
                >
                    {usuario.activo ? 'Desactivar' : 'Reactivar'}
                </button>
            </p>

            <p>
                <Link to="/usuarios">Volver a usuarios</Link>
            </p>
        </main>
    )
}
