import type { InputHTMLAttributes, ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'

type AuthFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'className' | 'id'
> & {
  id: string
  label: string
  error?: string
  action?: ReactNode
}

function AuthField({
  id,
  label,
  error,
  action,
  ...inputProps
}: AuthFieldProps) {
  const errorId = `${id}-error`

  return (
    <div className="auth-field">
      <label className="auth-label" htmlFor={id}>
        {label}
      </label>
      <div className={`auth-input-wrap${error ? ' has-error' : ''}`}>
        <input
          {...inputProps}
          id={id}
          className="auth-input"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
        />
        {action}
      </div>
      {error && (
        <p className="auth-field-error" id={errorId}>
          <AlertCircle size={14} aria-hidden="true" /> {error}
        </p>
      )}
    </div>
  )
}

export default AuthField
