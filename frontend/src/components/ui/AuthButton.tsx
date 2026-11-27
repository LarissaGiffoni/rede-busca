import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { LoaderCircle } from 'lucide-react'

type AuthButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
  children: ReactNode
}

function AuthButton({
  loading = false,
  disabled,
  children,
  ...buttonProps
}: AuthButtonProps) {
  return (
    <button
      {...buttonProps}
      className="auth-submit"
      disabled={disabled || loading}
      aria-busy={loading}
    >
      {loading ? (
        <>
          <LoaderCircle size={18} className="animate-spin" aria-hidden="true" />
          Aguarde...
        </>
      ) : (
        children
      )}
    </button>
  )
}

export default AuthButton
