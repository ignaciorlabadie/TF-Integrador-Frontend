import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listarPacientes } from '../../services/pacienteService'
import type { Paciente } from '../../types/paciente'
import { obtenerMensajeError } from '../../utils/errores'

export function PacientesPage() {
    const [pacientes, setPacientes] = useState<Paciente[]>([])
    const [error, setError] = useState('')
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        async function cargarPacientes() {
            try {
                const datos = await listarPacientes()
                setPacientes(datos)
            } catch (error) {
                setError(
                    obtenerMensajeError(
                        error,
                        'No se pudieron cargar los pacientes.',
                    ),
                )
            } finally {
                setCargando(false)
            }
        }

        cargarPacientes()
    }, [])

    return (
        <main>
            <h1>Pacientes</h1>

            {error && (
                <p role="alert" className="mensaje-error">
                    {error}
                </p>
            )}

            {cargando ? (
                <p>Cargando pacientes...</p>
            ) : pacientes.length === 0 ? (
                <p>No hay pacientes registrados.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>DNI</th>
                            <th>Email</th>
                            <th>Teléfono</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {pacientes.map((paciente) => (
                            <tr key={paciente.id}>
                                <td>{paciente.nombre}</td>
                                <td>{paciente.apellido}</td>
                                <td>{paciente.dni}</td>
                                <td>{paciente.usuario?.email ?? '-'}</td>
                                <td>{paciente.telefono}</td>
                                <td>
                                    <div className="acciones">
                                        <Link to={`/pacientes/${paciente.id}`}>
                                            Ver
                                        </Link>
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
