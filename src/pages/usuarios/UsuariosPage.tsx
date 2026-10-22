import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
    desactivarUsuario,
    listarUsuarios,
    reactivarUsuario,
} from '../../services/usuarioService'
import type { Usuario } from '../../types/usuario'
import { obtenerMensajeError } from '../../utils/errores'

export function UsuariosPage() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([])
    const [error, setError] = useState('')
    const [mensaje, setMensaje] = useState('')
    const [cargando, setCargando] = useState(true)
    const [procesandoId, setProcesandoId] = useState<number | null>(null)

    useEffect(() => {
        async function cargarUsuarios() {
            try {
                const datos = await listarUsuarios()
                setUsuarios(datos)
            } catch (error) {
                setError(
                    obtenerMensajeError(
                        error,
                        'No se pudieron cargar los usuarios.',
                    ),
                )
            } finally {
                setCargando(false)
            }
        }

        cargarUsuarios()
    }, [])

    async function handleCambiarEstado(usuario: Usuario) {
        setError('')
        setMensaje('')
        setProcesandoId(usuario.id)

        try {
            const actualizado = usuario.activo
                ? await desactivarUsuario(usuario.id)
                : await reactivarUsuario(usuario.id)

            setUsuarios((actuales) =>
                actuales.map((item) =>
                    item.id === actualizado.id ? actualizado : item,
                ),
            )

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
            setProcesandoId(null)
        }
    }

    return (
        <main>
            <h1>Usuarios</h1>

            <p>
                <Link to="/usuarios/nuevo">Crear usuario</Link>
            </p>

            {error && (
                <p role="alert" className="mensaje-error">
                    {error}
                </p>
            )}

            {mensaje && <p className="mensaje-exito">{mensaje}</p>}

            {cargando ? (
                <p>Cargando usuarios...</p>
            ) : usuarios.length === 0 ? (
                <p>No hay usuarios registrados.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {usuarios.map((usuario) => (
                            <tr key={usuario.id}>
                                <td>{usuario.id}</td>
                                <td>{usuario.email}</td>
                                <td>{usuario.rol}</td>
                                <td>
                                    {usuario.activo ? 'Activo' : 'Inactivo'}
                                </td>
                                <td>
                                    <div className="acciones">
                                        <Link to={`/usuarios/${usuario.id}`}>
                                            Ver
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleCambiarEstado(usuario)
                                            }
                                            disabled={
                                                procesandoId === usuario.id
                                            }
                                        >
                                            {usuario.activo
                                                ? 'Desactivar'
                                                : 'Reactivar'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </main>
    )
}
