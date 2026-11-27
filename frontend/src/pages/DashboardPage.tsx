import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function DashboardPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = () => {
    signOut()
    navigate('/login', { replace: true })
  }

  if (!user) return null

  return (
    <main className="dashboard-shell">
      <header className="dashboard-header">
        <Link className="dashboard-brand" to="/dashboard" aria-label="Rede Busca">
          <span className="dashboard-brand-mark" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M24 42.5S10.5 31.7 10.5 20.8a13.5 13.5 0 1 1 27 0C37.5 31.7 24 42.5 24 42.5Z"
                stroke="currentColor"
                strokeWidth="1.35"
              />
              <circle cx="24" cy="20.5" r="5.25" stroke="currentColor" strokeWidth="1.35" />
              <path
                d="M5 10.5h8M35 10.5h8M5 35h9m20 0h9M24 2v5m0 34v5"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
              />
              <circle cx="24" cy="20.5" r="1.5" fill="currentColor" />
            </svg>
          </span>
          <span className="dashboard-brand-name">Rede Busca</span>
        </Link>
        <button className="dashboard-logout" type="button" onClick={handleSignOut}>
          Sair
        </button>
      </header>

      <section className="dashboard-content" aria-labelledby="dashboard-title">
        <p className="dashboard-eyebrow">Área de acesso</p>
        <h1 id="dashboard-title">
          Olá, <span>{user.name}</span>.
        </h1>
        <p className="dashboard-description">
          Você está na sua área da Rede Busca. Este espaço será ampliado em breve.
        </p>
        <Link className="dashboard-create-link" to="/desaparecimentos/novo">
          Registrar desaparecimento
        </Link>
        <div className="dashboard-rule" />
        <p className="dashboard-account">
          Sessão iniciada como <strong>{user.email}</strong>
        </p>
      </section>
      <footer className="dashboard-footer">
        <span>Rede Busca</span>
        <span>Informação e apoio</span>
      </footer>
    </main>
  )
}

export default DashboardPage
