import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { crearUsuario } from '../../services/usuarioService'
import type { Rol } from '../../types/usuario'
import { obtenerMensajeError } from '../../utils/errores'

export function CrearUsuarioPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rol, setRol] = useState<Rol>('PROFESIONAL')
    const [activo, setActivo] = useState(true)
    const [error, setError] = useState('')
    const [cargando, setCargando] = useState(false)

    const navigate = useNavigate()

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError('')
        setCargando(true)

        try {
            await crearUsuario({ email, password, rol, activo })
            navigate('/usuarios')
        } catch (error) {
            setError(obtenerMensajeError(error, 'No se pudo crear el usuario.'))
        } finally {
            setCargando(false)
        }
    }

    return (
        <main>
            <h1>Crear usuario</h1>

            <p>
                El alta de pacientes se realiza desde el{' '}
                <Link to="/registro">registro de pacientes</Link>.
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
                    Contraseña
                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        minLength={8}
                        maxLength={72}
                        required
                    />
                </label>

                <label>
                    Rol
                    <select
                        value={rol}
                        onChange={(event) => setRol(event.target.value as Rol)}
                        required
                    >
                        <option value="PROFESIONAL">PROFESIONAL</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
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

                <button type="submit" disabled={cargando}>
                    {cargando ? 'Creando...' : 'Crear usuario'}
                </button>
            </form>

            <p>
                <Link to="/usuarios">Volver a usuarios</Link>
            </p>
        </main>
    )
}
