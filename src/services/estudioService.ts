import { api } from './api'
import type { CrearEstudio, Estudio, RespuestaArchivo } from '../types/estudio'

export async function listarEstudios(): Promise<Estudio[]> {
    const respuesta = await api.get<Estudio[]>('/estudios')
    return respuesta.data
}

export async function obtenerEstudioPorId(id: number): Promise<Estudio> {
    const respuesta = await api.get<Estudio>(`/estudios/${id}`)
    return respuesta.data
}

export async function listarEstudiosPaciente(
    pacienteId: number,
): Promise<Estudio[]> {
    const respuesta = await api.get<Estudio[]>(
        `/estudios/paciente/${pacienteId}`,
    )

    return respuesta.data
}

export async function crearEstudio(datos: CrearEstudio): Promise<Estudio> {
    const formData = new FormData()

    formData.append('pacienteId', String(datos.pacienteId))
    formData.append('tipo', datos.tipo)
    formData.append('fecha', datos.fecha)
    formData.append('descripcion', datos.descripcion)

    if (datos.archivo) {
        formData.append('archivo', datos.archivo)
    }

    const respuesta = await api.post<Estudio>('/estudios', formData)

    return respuesta.data
}

export async function actualizarArchivoEstudio(
    id: number,
    archivo: File,
): Promise<Estudio> {
    const formData = new FormData()
    formData.append('archivo', archivo)

    const respuesta = await api.put<Estudio>(
        `/estudios/${id}/archivo`,
        formData,
    )

    return respuesta.data
}

export async function obtenerUrlArchivo(
    id: number,
): Promise<RespuestaArchivo> {
    const respuesta = await api.get<RespuestaArchivo>(`/estudios/${id}/archivo`)
    return respuesta.data
}