import type { ReactNode } from 'react'
import { LockKeyhole } from 'lucide-react'
import { Link } from 'react-router-dom'

type AuthLayoutProps = {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
}

function Brand({ mobile = false }: { mobile?: boolean }) {
  return (
    <Link
      className={`auth-brand${mobile ? ' mobile-brand' : ''}`}
      to="/login"
      aria-label="Rede Busca — página de login"
    >
      <span className="brand-mark" aria-hidden="true">
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
            opacity=".72"
          />
          <circle cx="24" cy="20.5" r="1.5" fill="currentColor" />
        </svg>
      </span>
      <span>
        <span className="brand-name">Rede Busca</span>
        <span className="brand-caption">Apoio e informação</span>
      </span>
    </Link>
  )
}

function AuthLayout({ eyebrow, title, description, children }: AuthLayoutProps) {
  return (
    <main className="auth-shell">
      <aside className="auth-aside" aria-label="Sobre a Rede Busca">
        <Brand />
        <svg
          className="map-engraving"
          viewBox="0 0 580 460"
          fill="none"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M-25 85 105 36l112 28 120-47 122 39 146-28M-34 134l142-42 102 26 112-48 114 36 150-28M-27 188l152-42 96 24 126-51 108 34 136-26M-20 247l158-45 99 23 126-51 105 33 127-24M-16 308l163-45 100 23 127-51 106 32 124-23M-11 371l165-46 101 23 129-51 106 32 120-22M-4 430l168-47 101 22 130-51 107 32 116-21" stroke="currentColor" strokeWidth=".8" />
          <path d="m52-20 20 83-6 71 38 86-4 84 45 79 4 87M137-26l18 94-7 67 39 83-3 87 46 79 5 88M224-29l17 98-7 68 39 83-3 87 46 79 6 86M313-30l16 98-8 69 40 83-3 87 46 78 7 85M401-30l17 99-8 68 40 83-3 87 47 78 7 84M489-29l18 98-8 68 41 83-4 87 47 77 9 84" stroke="currentColor" strokeWidth=".8" />
          <path d="M158 239c0-25 20-45 45-45s45 20 45 45-45 72-45 72-45-47-45-72Z" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="203" cy="239" r="15" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="203" cy="239" r="3" fill="currentColor" />
          <path d="M248 239h71l45-37h62m-268 69-47 46h-60m242-77 31 34h54" stroke="currentColor" strokeWidth="1" strokeDasharray="3 5" />
          <circle cx="426" cy="202" r="4" fill="var(--color-ink)" stroke="currentColor" />
          <circle cx="49" cy="317" r="4" fill="var(--color-ink)" stroke="currentColor" />
          <circle cx="404" cy="274" r="4" fill="var(--color-ink)" stroke="currentColor" />
        </svg>
        <div className="auth-aside-copy">
          <span className="aside-kicker">Presença · informação · rede</span>
          <h1>
            Onde há
            <br />
            vínculo,
            <br />
            há <em>caminho.</em>
          </h1>
          <p className="aside-description">
            Uma iniciativa de apoio à busca por pessoas desaparecidas.
            Informação e conexão, com respeito a cada história.
          </p>
          <span className="aside-index">A busca se faz em rede</span>
        </div>
        <footer className="auth-aside-footer">
          <span>Rede Busca</span>
          <span>Informação e apoio</span>
        </footer>
      </aside>

      <section className="auth-main" aria-labelledby="auth-title">
        <div className="auth-panel">
          <Brand mobile />
          <header className="auth-heading">
            <p className="auth-eyebrow">{eyebrow}</p>
            <h2 id="auth-title">{title}</h2>
            <p>{description}</p>
          </header>
          {children}
          <p className="auth-privacy-note">
            <LockKeyhole size={14} aria-hidden="true" />
            Seus dados são tratados com cuidado e responsabilidade.
          </p>
        </div>
      </section>
    </main>
  )
}

export default AuthLayout
