export const TIPOS_ARCHIVO_ESTUDIO = [
    'application/pdf',
    'image/jpeg',
    'image/png',
]

export const TAMANIO_MAXIMO_ARCHIVO_ESTUDIO = 10 * 1024 * 1024

export const ACEPTAR_ARCHIVO_ESTUDIO = '.pdf,.jpg,.jpeg,.png'

export function validarArchivoEstudio(archivo: File): string | null {
    if (!TIPOS_ARCHIVO_ESTUDIO.includes(archivo.type)) {
        return 'Tipo de archivo no permitido. Solo se aceptan PDF, JPEG o PNG.'
    }

    if (archivo.size > TAMANIO_MAXIMO_ARCHIVO_ESTUDIO) {
        return 'El archivo supera el tamaño máximo permitido de 10 MB.'
    }

    return null
}
