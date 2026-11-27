import { useRef, useState, type FormEvent } from 'react'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/auth/AuthLayout'
import AuthButton from '../components/ui/AuthButton'
import AuthField from '../components/ui/AuthField'
import { useAuth } from '../contexts/AuthContext'
import { ApiError } from '../services/api'

type LoginValues = {
  email: string
  password: string
}

function LoginPage() {
  const { signIn } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const submitLock = useRef(false)
  const [values, setValues] = useState<LoginValues>({ email: '', password: '' })
  const [errors, setErrors] = useState<Partial<LoginValues>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formMessage, setFormMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState(
    (location.state as { notice?: string } | null)?.notice ?? '',
  )

  const validate = () => {
    const nextErrors: Partial<LoginValues> = {}
    const email = values.email.trim()

    if (!email) {
      nextErrors.email = 'Informe seu e-mail.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = 'Digite um endereço de e-mail válido.'
    }

    if (!values.password) {
      nextErrors.password = 'Informe sua senha.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormMessage('')

    if (submitLock.current || !validate()) return

    submitLock.current = true
    setIsLoading(true)
    setSuccessMessage('')

    try {
      await signIn({ email: values.email.trim(), password: values.password })
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setFormMessage(
        error instanceof ApiError
          ? error.message
          : 'Não foi possível entrar. Tente novamente.',
      )
    } finally {
      submitLock.current = false
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Bem-vindo(a) de volta"
      title="Entre na sua conta"
      description="Acesse sua conta para continuar na Rede Busca."
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <AuthField
          id="login-email"
          label="E-mail"
          type="email"
          name="email"
          placeholder="voce@exemplo.com.br"
          autoComplete="email"
          inputMode="email"
          required
          value={values.email}
          error={errors.email}
          onChange={(event) => {
            setValues({ ...values, email: event.target.value })
            setErrors({ ...errors, email: undefined })
            setFormMessage('')
            setSuccessMessage('')
          }}
        />

        <AuthField
          id="login-password"
          label="Senha"
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Digite sua senha"
          autoComplete="current-password"
          required
          value={values.password}
          error={errors.password}
          onChange={(event) => {
            setValues({ ...values, password: event.target.value })
            setErrors({ ...errors, password: undefined })
            setFormMessage('')
            setSuccessMessage('')
          }}
          action={
            <button
              className="auth-input-action"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              aria-pressed={showPassword}
            >
              {showPassword ? (
                <EyeOff size={18} aria-hidden="true" />
              ) : (
                <Eye size={18} aria-hidden="true" />
              )}
            </button>
          }
        />

        {formMessage && <p className="auth-alert" role="alert">{formMessage}</p>}
        {!formMessage && successMessage && (
          <p className="auth-alert auth-alert-success" role="status">
            {successMessage}
          </p>
        )}

        <AuthButton type="submit" loading={isLoading}>
          Entrar
          <ArrowRight size={17} aria-hidden="true" />
        </AuthButton>
      </form>

      <p className="auth-switch">
        Ainda não tem uma conta?
        <Link to="/register">Criar conta</Link>
      </p>
    </AuthLayout>
  )
}

export default LoginPage
