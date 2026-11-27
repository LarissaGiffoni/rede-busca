import { useRef, useState, type FormEvent } from 'react'
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  X,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/auth/AuthLayout'
import AuthButton from '../components/ui/AuthButton'
import AuthField from '../components/ui/AuthField'
import { ApiError } from '../services/api'
import { registerUser } from '../services/auth.service'

type RegisterValues = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

type RegisterErrors = Partial<Record<keyof RegisterValues, string>>

function RegisterPage() {
  const navigate = useNavigate()
  const submitLock = useRef(false)
  const [values, setValues] = useState<RegisterValues>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<RegisterErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formMessage, setFormMessage] = useState('')

  const passwordBytes = new TextEncoder().encode(values.password).length
  const hasMinimumLength = values.password.length >= 8
  const withinByteLimit = passwordBytes <= 72

  const validate = () => {
    const nextErrors: RegisterErrors = {}
    const email = values.email.trim()

    if (values.name.trim().length < 2) {
      nextErrors.name = 'Informe seu nome completo.'
    }
    if (!email) {
      nextErrors.email = 'Informe seu e-mail.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = 'Digite um endereço de e-mail válido.'
    }
    if (!hasMinimumLength) {
      nextErrors.password = 'A senha deve ter pelo menos 8 caracteres.'
    } else if (!withinByteLimit) {
      nextErrors.password = 'A senha não pode ultrapassar 72 bytes em UTF-8.'
    }
    if (!values.confirmPassword) {
      nextErrors.confirmPassword = 'Confirme sua senha.'
    } else if (values.confirmPassword !== values.password) {
      nextErrors.confirmPassword = 'As senhas não coincidem.'
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
    try {
      await registerUser({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      })
      navigate('/login', {
        replace: true,
        state: { notice: 'Cadastro realizado. Agora você já pode entrar.' },
      })
    } catch (error) {
      if (error instanceof ApiError) {
        const fieldMap: Record<string, keyof RegisterValues> = {
          name: 'name',
          email: 'email',
          password: 'password',
        }
        const serverErrors: RegisterErrors = {}

        for (const detail of error.details) {
          const field = fieldMap[detail.field]
          if (field) serverErrors[field] = detail.message
        }

        setErrors((current) => ({ ...current, ...serverErrors }))
        setFormMessage(error.message)
      } else {
        setFormMessage('Não foi possível criar sua conta. Tente novamente.')
      }
    } finally {
      submitLock.current = false
      setIsLoading(false)
    }
  }

  const updateValue = (field: keyof RegisterValues, value: string) => {
    setValues({ ...values, [field]: value })
    setErrors({ ...errors, [field]: undefined })
    setFormMessage('')
  }

  return (
    <AuthLayout
      eyebrow="Faça parte da rede"
      title="Crie sua conta"
      description="Preencha seus dados para começar. É rápido e gratuito."
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <AuthField
          id="register-name"
          label="Nome completo"
          type="text"
          name="name"
          placeholder="Como podemos chamar você?"
          autoComplete="name"
          autoCapitalize="words"
          required
          value={values.name}
          error={errors.name}
          onChange={(event) => updateValue('name', event.target.value)}
        />

        <AuthField
          id="register-email"
          label="E-mail"
          type="email"
          name="email"
          placeholder="voce@exemplo.com.br"
          autoComplete="email"
          inputMode="email"
          required
          value={values.email}
          error={errors.email}
          onChange={(event) => updateValue('email', event.target.value)}
        />

        <AuthField
          id="register-password"
          label="Senha"
          type={showPassword ? 'text' : 'password'}
          name="new-password"
          placeholder="Crie uma senha segura"
          autoComplete="new-password"
          required
          value={values.password}
          error={errors.password}
          onChange={(event) => updateValue('password', event.target.value)}
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

        <ul className="password-requirements" aria-label="Requisitos da senha">
          <li className={hasMinimumLength ? 'is-met' : ''}>
            {hasMinimumLength ? (
              <Check size={15} aria-hidden="true" />
            ) : (
              <X size={15} aria-hidden="true" />
            )}
            Pelo menos 8 caracteres
          </li>
          <li className={withinByteLimit ? 'is-met' : ''}>
            {withinByteLimit ? (
              <Check size={15} aria-hidden="true" />
            ) : (
              <X size={15} aria-hidden="true" />
            )}
            Até 72 bytes em UTF-8
          </li>
        </ul>

        <AuthField
          id="register-confirm-password"
          label="Confirmar senha"
          type={showConfirmation ? 'text' : 'password'}
          name="confirm-password"
          placeholder="Digite sua senha novamente"
          autoComplete="new-password"
          required
          value={values.confirmPassword}
          error={errors.confirmPassword}
          onChange={(event) =>
            updateValue('confirmPassword', event.target.value)
          }
          action={
            <button
              className="auth-input-action"
              type="button"
              onClick={() => setShowConfirmation(!showConfirmation)}
              aria-label={
                showConfirmation
                  ? 'Ocultar confirmação de senha'
                  : 'Mostrar confirmação de senha'
              }
              aria-pressed={showConfirmation}
            >
              {showConfirmation ? (
                <EyeOff size={18} aria-hidden="true" />
              ) : (
                <Eye size={18} aria-hidden="true" />
              )}
            </button>
          }
        />

        {formMessage && <p className="auth-alert" role="alert">{formMessage}</p>}

        <AuthButton type="submit" loading={isLoading}>
          Criar conta
          <ArrowRight size={17} aria-hidden="true" />
        </AuthButton>
      </form>

      <p className="auth-switch">
        Já tem uma conta?
        <Link to="/login">Voltar ao login</Link>
      </p>
    </AuthLayout>
  )
}

export default RegisterPage
