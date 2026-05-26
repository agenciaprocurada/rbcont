'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'

export default function CadastroPage() {
  return (
    <Suspense fallback={null}>
      <CadastroInner />
    </Suspense>
  )
}

function CadastroInner() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 2) return digits
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(data?.error || 'Não foi possível enviar seu cadastro. Tente novamente.')
        return
      }

      setDone(true)
    } catch {
      setError('Falha de conexão. Verifique sua internet e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="tc-login">
        <aside className="tc-login__brand">
          <div className="tc-login__brandRow">
            <div className="tc-login__brandMark">R</div>
            <div>
              <div className="tc-login__brandText">RBCont</div>
              <div className="tc-login__brandSub mono">Knowledge Base</div>
            </div>
          </div>

          <div className="tc-login__brandBody">
            <div className="tc-login__eyebrow">
              <span className="tc-login__eyebrowDot" />
              Cadastro recebido
            </div>
            <h1 className="tc-login__title">
              Solicitação<br />
              <span className="tc-login__accent">enviada</span>.
            </h1>
            <p className="tc-login__desc">
              Seu cadastro foi recebido e está aguardando aprovação de um administrador.
              Assim que liberado, você poderá entrar com seu e-mail e senha.
            </p>
          </div>

          <div className="tc-login__brandFoot mono">
            <span>© 2026 RBCont · base de conhecimento</span>
          </div>
        </aside>

        <section className="tc-login__formPanel">
          <div className="tc-login__formCard">
            <h2 className="tc-login__formTitle">Tudo certo!</h2>
            <p className="tc-login__formSub">
              Sua solicitação está na fila de aprovações. Você receberá acesso após a revisão.
            </p>

            <Link
              href="/login"
              className="tc-login__submit"
              style={{ textAlign: 'center', textDecoration: 'none' }}
            >
              Ir para o login
            </Link>

            <p className="tc-login__legal">
              Plataforma RBCont.<br />
              Atividades nesta plataforma são registradas.
            </p>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="tc-login">
      <aside className="tc-login__brand">
        <div className="tc-login__brandRow">
          <div className="tc-login__brandMark">R</div>
          <div>
            <div className="tc-login__brandText">RBCont</div>
            <div className="tc-login__brandSub mono">Knowledge Base</div>
          </div>
        </div>

        <div className="tc-login__brandBody">
          <div className="tc-login__eyebrow">
            <span className="tc-login__eyebrowDot" />
            Novo acesso · v3.2
          </div>
          <h1 className="tc-login__title">
            Solicite seu<br />
            <span className="tc-login__accent">acesso</span>.
          </h1>
          <p className="tc-login__desc">
            Preencha o formulário ao lado para solicitar acesso à base de conhecimento.
            Um administrador irá revisar e liberar seu cadastro.
          </p>
        </div>

        <div className="tc-login__brandFoot mono">
          <span>© 2026 RBCont · base de conhecimento</span>
        </div>
      </aside>

      <section className="tc-login__formPanel">
        <form className="tc-login__formCard" onSubmit={handleSubmit}>
          <h2 className="tc-login__formTitle">Criar conta</h2>
          <p className="tc-login__formSub">Preencha seus dados para solicitar acesso.</p>

          <div className="tc-login__field">
            <label className="tc-login__label" htmlFor="name">Nome completo</label>
            <div className="tc-login__inputWrap">
              <span className="tc-login__lead">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21a8 8 0 0 1 16 0" />
                </svg>
              </span>
              <input
                className="tc-login__input"
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={3}
                maxLength={120}
                autoComplete="name"
                placeholder="Seu nome"
              />
            </div>
          </div>

          <div className="tc-login__field">
            <label className="tc-login__label" htmlFor="email">E-mail</label>
            <div className="tc-login__inputWrap">
              <span className="tc-login__lead">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
              </span>
              <input
                className="tc-login__input"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="nome@empresa.com.br"
              />
            </div>
          </div>

          <div className="tc-login__field">
            <label className="tc-login__label" htmlFor="phone">Telefone</label>
            <div className="tc-login__inputWrap">
              <span className="tc-login__lead">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </span>
              <input
                className="tc-login__input"
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                required
                autoComplete="tel"
                placeholder="(11) 99999-9999"
                inputMode="tel"
              />
            </div>
          </div>

          <div className="tc-login__field">
            <label className="tc-login__label" htmlFor="senha">Senha</label>
            <div className="tc-login__inputWrap">
              <span className="tc-login__lead">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="11" width="16" height="11" rx="2" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                </svg>
              </span>
              <input
                className="tc-login__input tc-login__input--hasTrail"
                id="senha"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                maxLength={128}
                autoComplete="new-password"
                placeholder="Mínimo 8 caracteres"
              />
              <button
                type="button"
                className="tc-login__trail"
                onClick={() => setShowPassword((v) => !v)}
                title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
          </div>

          {error && (
            <div className="tc-login__error">
              {error}
            </div>
          )}

          <button className="tc-login__submit" type="submit" disabled={loading}>
            {loading ? 'Enviando…' : 'Solicitar acesso'}
            {!loading && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            )}
          </button>

          <p className="tc-login__legal" style={{ marginTop: 12 }}>
            Já tem uma conta?{' '}
            <Link href="/login" style={{ color: 'var(--color-primary, #b5793f)', fontWeight: 600 }}>
              Entrar
            </Link>
          </p>

          <p className="tc-login__legal">
            Plataforma RBCont.<br />
            Seu cadastro passará por aprovação manual.
          </p>
        </form>
      </section>
    </div>
  )
}
