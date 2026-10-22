import { useEffect, useState } from 'react'
import {
    obtenerMiPerfil,
    modificarMiPerfil,
} from '../../services/pacienteService'
import type { Paciente } from '../../types/paciente'

export default function PerfilPacientePage() {
    const [paciente, setPaciente] = useState<Paciente | null>(null)
    const [error, setError] = useState('')
    const [cargando, setCargando] = useState(true)
    const [guardando, setGuardando] = useState(false)
    const [mensaje, setMensaje] = useState('')

    useEffect(() => {
        async function cargarPerfil() {
            try {
                const datos = await obtenerMiPerfil()
                setPaciente(datos)
            } catch {
                setError('No se pudo cargar el perfil del paciente.')
            } finally {
                setCargando(false)
            }
        }

        cargarPerfil()
    }, [])

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!paciente) return

        setGuardando(true)
        setMensaje('')

        try {
            const actualizado = await modificarMiPerfil({
                nombre: paciente.nombre,
                apellido: paciente.apellido,
                dni: paciente.dni,
                telefono: paciente.telefono,
                fechaNacimiento: paciente.fechaNacimiento,
                direccion: paciente.direccion,
            })

            setPaciente(actualizado)
            setMensaje('Perfil actualizado correctamente.')
        } catch {
            setMensaje('No se pudo actualizar el perfil.')
        } finally {
            setGuardando(false)
        }
    }

    if (cargando) {
        return <p>Cargando perfil...</p>
    }

    if (error) {
        return <p>{error}</p>
    }

    if (!paciente) {
        return <p>No se encontró el perfil.</p>
    }

    return (
        <main>
            <h1>Mi perfil</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Nombre
                    <input
                        value={paciente.nombre}
                        onChange={(e) =>
                            setPaciente({ ...paciente, nombre: e.target.value })
                        }
                        required
                        minLength={2}
                        maxLength={100}
                    />
                </label>

                <label>
                    Apellido
                    <input
                        value={paciente.apellido}
                        onChange={(e) =>
                            setPaciente({
                                ...paciente,
                                apellido: e.target.value,
                            })
                        }
                        required
                        minLength={2}
                        maxLength={100}
                    />
                </label>

                <label>
                    DNI
                    <input
                        value={paciente.dni}
                        onChange={(e) =>
                            setPaciente({ ...paciente, dni: e.target.value })
                        }
                        required
                        maxLength={10}
                    />
                </label>

                <label>
                    Teléfono
                    <input
                        value={paciente.telefono}
                        onChange={(e) =>
                            setPaciente({
                                ...paciente,
                                telefono: e.target.value,
                            })
                        }
                        required
                        minLength={6}
                        maxLength={25}
                    />
                </label>

                <label>
                    Fecha de nacimiento
                    <input
                        type="date"
                        value={paciente.fechaNacimiento}
                        onChange={(e) =>
                            setPaciente({
                                ...paciente,
                                fechaNacimiento: e.target.value,
                            })
                        }
                        required
                    />
                </label>

                <label>
                    Dirección
                    <input
                        value={paciente.direccion}
                        onChange={(e) =>
                            setPaciente({
                                ...paciente,
                                direccion: e.target.value,
                            })
                        }
                        required
                        minLength={3}
                        maxLength={150}
                    />
                </label>

                <button type="submit" disabled={guardando}>
                    {guardando ? 'Guardando...' : 'Guardar cambios'}
                </button>

                {mensaje && <p>{mensaje}</p>}
            </form>
        </main>
    )
}
