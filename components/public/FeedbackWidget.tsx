'use client'

import { useState, useEffect } from 'react'

interface Props {
  articleId: string
}

type State = 'idle' | 'submitting' | 'done'

export default function FeedbackWidget({ articleId }: Props) {
  const [widgetState, setWidgetState] = useState<State>('idle')

  useEffect(() => {
    if (sessionStorage.getItem(`feedback_${articleId}`)) {
      setWidgetState('done')
    }
  }, [articleId])

  async function handleVote(helpful: boolean) {
    if (widgetState !== 'idle') return
    setWidgetState('submitting')
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId, helpful }),
      })
    } catch {
      // Falha silenciosa — feedback não é crítico
    }
    sessionStorage.setItem(`feedback_${articleId}`, '1')
    setWidgetState('done')
  }

  if (widgetState === 'done') {
    return (
      <p style={{ fontSize: 12, color: 'var(--ink-2)', margin: 0, fontWeight: 600 }}>
        Obrigado pelo seu feedback!
      </p>
    )
  }

  return (
    <div className="tc-artPage__feedbackBtns">
      <button
        type="button"
        className="tc-artPage__feedbackBtn"
        onClick={() => handleVote(true)}
        disabled={widgetState === 'submitting'}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 10v12" />
          <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7a2 2 0 0 1-2-2V12a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11l1.86-3.72A1 1 0 0 1 12.31 5h.31a2 2 0 0 1 2 2z" />
        </svg>
        Sim
      </button>
      <button
        type="button"
        className="tc-artPage__feedbackBtn"
        onClick={() => handleVote(false)}
        disabled={widgetState === 'submitting'}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 14V2" />
          <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11l-1.86 3.72A1 1 0 0 1 9.69 19h-.31a2 2 0 0 1-2-2z" />
        </svg>
        Não
      </button>
    </div>
  )
}
