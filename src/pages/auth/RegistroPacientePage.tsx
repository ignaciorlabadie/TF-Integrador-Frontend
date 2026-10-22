import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registrarPaciente } from '../../services/pacienteService'
import { obtenerMensajeError } from '../../utils/errores'

interface FormularioRegistro {
    email: string
    password: string
    nombre: string
    apellido: string
    dni: string
    telefono: string
    fechaNacimiento: string
    direccion: string
}

const formularioInicial: FormularioRegistro = {
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    dni: '',
    telefono: '',
    fechaNacimiento: '',
    direccion: '',
}

export function RegistroPacientePage() {
    const [formulario, setFormulario] =
        useState<FormularioRegistro>(formularioInicial)
    const [error, setError] = useState('')
    const [cargando, setCargando] = useState(false)

    const navigate = useNavigate()

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target

        setFormulario((actual) => ({ ...actual, [name]: value }))
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError('')
        setCargando(true)

        try {
            await registrarPaciente(formulario)
            navigate('/login')
        } catch (error) {
            setError(
                obtenerMensajeError(
                    error,
                    'No se pudo registrar la cuenta. Verificá los datos.',
                ),
            )
        } finally {
            setCargando(false)
        }
    }

    return (
        <main>
            <h1>Registro de paciente</h1>

            <form onSubmit={handleSubmit}>
                <label>
                    Email
                    <input
                        name="email"
                        type="email"
                        value={formulario.email}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Contraseña
                    <input
                        name="password"
                        type="password"
                        value={formulario.password}
                        onChange={handleChange}
                        minLength={8}
                        maxLength={72}
                        required
                    />
                </label>

                <label>
                    Nombre
                    <input
                        name="nombre"
                        value={formulario.nombre}
                        onChange={handleChange}
                        minLength={2}
                        maxLength={100}
                        required
                    />
                </label>

                <label>
                    Apellido
                    <input
                        name="apellido"
                        value={formulario.apellido}
                        onChange={handleChange}
                        minLength={2}
                        maxLength={100}
                        required
                    />
                </label>

                <label>
                    DNI
                    <input
                        name="dni"
                        value={formulario.dni}
                        onChange={handleChange}
                        inputMode="numeric"
                        pattern="[0-9]{7,8}"
                        maxLength={8}
                        required
                    />
                </label>

                <label>
                    Teléfono
                    <input
                        name="telefono"
                        type="tel"
                        value={formulario.telefono}
                        onChange={handleChange}
                        pattern="[+]?[0-9]{6,25}"
                        maxLength={26}
                        required
                    />
                </label>

                <label>
                    Fecha de nacimiento
                    <input
                        name="fechaNacimiento"
                        type="date"
                        value={formulario.fechaNacimiento}
                        onChange={handleChange}
                        max={new Date().toISOString().slice(0, 10)}
                        required
                    />
                </label>

                <label>
                    Dirección
                    <input
                        name="direccion"
                        value={formulario.direccion}
                        onChange={handleChange}
                        minLength={3}
                        maxLength={150}
                        required
                    />
                </label>

                {error && (
                    <p role="alert" className="mensaje-error">
                        {error}
                    </p>
                )}

                <button type="submit" disabled={cargando}>
                    {cargando ? 'Registrando...' : 'Crear cuenta'}
                </button>
            </form>

            <p>
                ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
            </p>
        </main>
    )
}
