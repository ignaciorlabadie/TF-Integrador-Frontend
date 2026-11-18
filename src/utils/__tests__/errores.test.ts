import { AxiosError, AxiosHeaders } from 'axios'
import { describe, expect, it } from 'vitest'
import { obtenerMensajeError } from '../errores'

function crearAxiosError(mensaje: unknown, status = 400) {
    return new AxiosError(
        'Request failed',
        'ERR_BAD_REQUEST',
        undefined,
        undefined,
        {
            status,
            statusText: 'Bad Request',
            headers: {},
            config: { headers: new AxiosHeaders() },
            data: { mensaje },
        },
    )
}

describe('obtenerMensajeError', () => {
    it('devuelve el mensaje provisto por la respuesta axios', () => {
        const error = crearAxiosError('Email ya registrado')
        expect(obtenerMensajeError(error, 'Por defecto')).toBe(
            'Email ya registrado',
        )
    })

    it('devuelve el mensaje por defecto si el mensaje axios está vacío o no es string', () => {
        expect(obtenerMensajeError(crearAxiosError('   '), 'Por defecto')).toBe(
            'Por defecto',
        )
        expect(obtenerMensajeError(crearAxiosError(123), 'Por defecto')).toBe(
            'Por defecto',
        )
        expect(
            obtenerMensajeError(crearAxiosError(undefined), 'Por defecto'),
        ).toBe('Por defecto')
    })

    it('devuelve el mensaje por defecto para errores no axios', () => {
        expect(obtenerMensajeError(new Error('fallo'), 'Por defecto')).toBe(
            'Por defecto',
        )
        expect(obtenerMensajeError('x', 'Por defecto')).toBe('Por defecto')
        expect(obtenerMensajeError(null, 'Por defecto')).toBe('Por defecto')
    })
})
