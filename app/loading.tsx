// Fallback root para qualquer rota sem loading.tsx mais específico.
// Cobre /login, /cadastro e qualquer rota nova fora dos grupos (admin)/(public).

export default function RootLoading() {
  return (
    <div className="rb-rskel">
      <div className="rb-rskel__spinner" aria-label="Carregando">
        <span className="rb-rskel__dot" />
        <span className="rb-rskel__dot" />
        <span className="rb-rskel__dot" />
      </div>
      <p className="rb-rskel__text">Carregando…</p>

      <style>{`
        .rb-rskel {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 14px;
          background: var(--bg, #f4f1ed);
        }
        .rb-rskel__spinner {
          display: inline-flex;
          gap: 8px;
        }
        .rb-rskel__dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: var(--color-primary, #2a2a2f);
          animation: rb-rskel-bounce 1.2s ease-in-out infinite both;
        }
        .rb-rskel__dot:nth-child(1) { animation-delay: -0.32s; }
        .rb-rskel__dot:nth-child(2) { animation-delay: -0.16s; }
        .rb-rskel__text {
          font-family: var(--font-mono, 'JetBrains Mono', monospace);
          font-size: 11px;
          color: var(--ink-3, #6b6b75);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin: 0;
        }
        @keyframes rb-rskel-bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
          40%           { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </div>
  )
}
