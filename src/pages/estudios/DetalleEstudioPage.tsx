import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
    actualizarArchivoEstudio,
    obtenerEstudioPorId,
    obtenerUrlArchivo,
} from '../../services/estudioService'
import type { Estudio } from '../../types/estudio'
import {
    ACEPTAR_ARCHIVO_ESTUDIO,
    validarArchivoEstudio,
} from '../../utils/archivos'
import { obtenerMensajeError } from '../../utils/errores'

export function DetalleEstudioPage() {
    const { id } = useParams()
    const estudioId = Number(id)

    const [estudio, setEstudio] = useState<Estudio | null>(null)
    const [archivo, setArchivo] = useState<File | null>(null)
    const [error, setError] = useState('')
    const [mensaje, setMensaje] = useState('')
    const [cargando, setCargando] = useState(true)
    const [guardando, setGuardando] = useState(false)
    const [abriendo, setAbriendo] = useState(false)

    useEffect(() => {
        async function cargarEstudio() {
            try {
                const datos = await obtenerEstudioPorId(estudioId)
                setEstudio(datos)
            } catch (error) {
                setError(
                    obtenerMensajeError(error, 'No se pudo cargar el estudio.'),
                )
            } finally {
                setCargando(false)
            }
        }

        cargarEstudio()
    }, [estudioId])

    function handleArchivoChange(event: React.ChangeEvent<HTMLInputElement>) {
        const seleccionado = event.target.files?.[0] ?? null
        setError('')
        setMensaje('')

        if (seleccionado) {
            const errorArchivo = validarArchivoEstudio(seleccionado)

            if (errorArchivo) {
                setError(errorArchivo)
                event.target.value = ''
                setArchivo(null)
                return
            }
        }

        setArchivo(seleccionado)
    }

    async function handleAbrirArchivo() {
        if (!estudio?.archivoURL) return

        setError('')
        setAbriendo(true)

        try {
            const { url } = await obtenerUrlArchivo(estudio.id)
            window.open(url, '_blank', 'noopener,noreferrer')
        } catch (error) {
            setError(obtenerMensajeError(error, 'No se pudo abrir el archivo.'))
        } finally {
            setAbriendo(false)
        }
    }

    async function handleReemplazarArchivo(
        event: React.FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault()

        if (!estudio) return

        setError('')
        setMensaje('')

        if (!archivo) {
            setError('Seleccioná un archivo para reemplazar.')
            return
        }

        const errorArchivo = validarArchivoEstudio(archivo)

        if (errorArchivo) {
            setError(errorArchivo)
            return
        }

        setGuardando(true)

        try {
            const actualizado = await actualizarArchivoEstudio(
                estudio.id,
                archivo,
            )

            setEstudio({ ...estudio, archivoURL: actualizado.archivoURL })
            setArchivo(null)
            setMensaje('Archivo actualizado correctamente.')
        } catch (error) {
            setError(
                obtenerMensajeError(error, 'No se pudo actualizar el archivo.'),
            )
        } finally {
            setGuardando(false)
        }
    }

    if (cargando) {
        return <p>Cargando estudio...</p>
    }

    if (!estudio) {
        return (
            <main>
                <p className="mensaje-error">{error}</p>
                <p>
                    <Link to="/estudios">Volver a estudios</Link>
                </p>
            </main>
        )
    }

    return (
        <main>
            <h1>Estudio {estudio.id}</h1>

            <dl className="datos-estudio">
                <dt>Paciente</dt>
                <dd>
                    {estudio.paciente
                        ? `${estudio.paciente.apellido}, ${estudio.paciente.nombre} (DNI ${estudio.paciente.dni})`
                        : `#${estudio.pacienteId}`}
                </dd>

                <dt>Tipo</dt>
                <dd>{estudio.tipo}</dd>

                <dt>Fecha</dt>
                <dd>{estudio.fecha}</dd>

                <dt>Descripción</dt>
                <dd>{estudio.descripcion}</dd>
            </dl>

            <section className="seccion-estudio">
                <h2>Archivo</h2>

                {estudio.archivoURL ? (
                    <>
                        <p>El estudio tiene un archivo adjunto.</p>

                        <div className="archivo-acciones">
                            <button
                                type="button"
                                onClick={handleAbrirArchivo}
                                disabled={abriendo}
                            >
                                {abriendo ? 'Abriendo...' : 'Abrir archivo'}
                            </button>
                        </div>
                    </>
                ) : (
                    <p>Sin archivo adjunto.</p>
                )}

                <form onSubmit={handleReemplazarArchivo}>
                    <label>
                        Reemplazar archivo
                        <input
                            type="file"
                            accept={ACEPTAR_ARCHIVO_ESTUDIO}
                            onChange={handleArchivoChange}
                        />
                    </label>

                    {error && (
                        <p role="alert" className="mensaje-error">
                            {error}
                        </p>
                    )}

                    {mensaje && <p className="mensaje-exito">{mensaje}</p>}

                    <button type="submit" disabled={guardando || !archivo}>
                        {guardando ? 'Subiendo...' : 'Reemplazar archivo'}
                    </button>
                </form>
            </section>

            <section className="seccion-estudio">
                <h2>Autorizaciones</h2>

                {estudio.autorizaciones?.length ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Profesional</th>
                                <th>Especialidad</th>
                                <th>Desde</th>
                                <th>Hasta</th>
                                <th>Estado</th>
                            </tr>
                        </thead>

                        <tbody>
                            {estudio.autorizaciones.map((autorizacion) => (
                                <tr key={autorizacion.id}>
                                    <td>
                                        {autorizacion.profesional
                                            ? `${autorizacion.profesional.apellido}, ${autorizacion.profesional.nombre}`
                                            : `#${autorizacion.profesionalId}`}
                                    </td>
                                    <td>
                                        {autorizacion.profesional
                                            ?.especialidad ?? '-'}
                                    </td>
                                    <td>{autorizacion.fechaAutorizacion}</td>
                                    <td>{autorizacion.fechaVencimiento}</td>
                                    <td
                                        className={`estado-autorizacion ${
                                            autorizacion.estado === 'DISPONIBLE'
                                                ? 'estado-disponible'
                                                : 'estado-vencido'
                                        }`}
                                    >
                                        {autorizacion.estado}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Sin autorizaciones registradas.</p>
                )}
            </section>

            <p>
                <Link to="/estudios">Volver a estudios</Link>
            </p>
        </main>
    )
}
