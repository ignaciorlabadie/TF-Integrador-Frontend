import axios from 'axios'

export function obtenerMensajeError(
    error: unknown,
    mensajePorDefecto: string,
): string {
    if (axios.isAxiosError(error)) {
        const datos = error.response?.data as { mensaje?: unknown } | undefined

        if (typeof datos?.mensaje === 'string' && datos.mensaje.trim()) {
            return datos.mensaje
        }
    }

    return mensajePorDefecto
}
