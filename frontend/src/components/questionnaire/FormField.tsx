import type { ReactNode } from 'react'

type FormFieldProps = {
  label: string
  htmlFor?: string
  required?: boolean
  hint?: string
  error?: string
  children: ReactNode
}

function FormField({
  label,
  htmlFor,
  required = false,
  hint,
  error,
  children,
}: FormFieldProps) {
  return (
    <div className="question-field">
      {htmlFor ? (
        <label className="question-label" htmlFor={htmlFor}>
          {label}
          {required && (
            <span className="question-required" aria-label="obrigatório">
              {' '}*
            </span>
          )}
        </label>
      ) : (
        <span className="question-label">
          {label}
          {required && <span className="question-required"> *</span>}
        </span>
      )}
      {children}
      {hint && <p className="question-hint">{hint}</p>}
      {error && (
        <p className="question-error" id={htmlFor ? `${htmlFor}-error` : undefined} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export default FormField
