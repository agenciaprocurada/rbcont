'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { approveRegistration, rejectRegistration } from '@/app/(admin)/admin/aprovacoes/actions'
import type { UserRole, PendingRegistrationStatus } from '@prisma/client'

type PendingItem = {
  id: string
  name: string
  email: string
  phone: string
  createdAt: Date
}

type HistoryItem = {
  id: string
  name: string
  email: string
  phone: string
  status: PendingRegistrationStatus
  createdAt: Date
  reviewedAt: Date | null
  rejectReason: string | null
}

export function ApprovalsList({
  pending,
  history,
}: {
  pending: PendingItem[]
  history: HistoryItem[]
}) {
  const router = useRouter()
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const [approveModal, setApproveModal] = useState<{ item: PendingItem; role: UserRole } | null>(null)
  const [rejectModal, setRejectModal] = useState<{ item: PendingItem; reason: string } | null>(null)

  async function confirmApprove() {
    if (!approveModal) return
    setError('')
    setBusyId(approveModal.item.id)
    try {
      await approveRegistration({ id: approveModal.item.id, role: approveModal.role })
      setApproveModal(null)
      router.refresh()
    } catch (e: any) {
      setError(e?.message || 'Erro ao aprovar.')
    } finally {
      setBusyId(null)
    }
  }

  async function confirmReject() {
    if (!rejectModal) return
    setError('')
    setBusyId(rejectModal.item.id)
    try {
      await rejectRegistration({ id: rejectModal.item.id, reason: rejectModal.reason })
      setRejectModal(null)
      router.refresh()
    } catch (e: any) {
      setError(e?.message || 'Erro ao rejeitar.')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <>
      {error && (
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', padding: '12px 14px', color: '#dc2626', fontSize: '14px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      <section style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Pendentes
          </h2>
          <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
            {pending.length} aguardando
          </span>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--color-border)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          {pending.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '40px 20px', fontSize: '14px', color: 'var(--text-tertiary)', margin: 0 }}>
              Nenhuma solicitação pendente no momento.
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    {['Nome', 'E-mail', 'Telefone', 'Solicitado em', ''].map((col, i) => (
                      <th key={i} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid var(--color-border)' }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pending.map((item, index) => (
                    <tr key={item.id} style={{ borderBottom: index < pending.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                      <td style={{ padding: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</td>
                      <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{item.email}</td>
                      <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{item.phone}</td>
                      <td style={{ padding: '16px', fontSize: '13px', color: 'var(--text-tertiary)' }}>
                        {new Date(item.createdAt).toLocaleString('pt-BR')}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button
                          onClick={() => setApproveModal({ item, role: 'VIEWER' })}
                          disabled={busyId === item.id}
                          className="btn-primary"
                          style={{ padding: '6px 12px', fontSize: '12px', marginRight: '8px' }}
                        >
                          Aprovar
                        </button>
                        <button
                          onClick={() => setRejectModal({ item, reason: '' })}
                          disabled={busyId === item.id}
                          style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, backgroundColor: 'transparent', border: '1px solid var(--color-border)', color: 'var(--text-secondary)', cursor: 'pointer' }}
                        >
                          Rejeitar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 12px 0' }}>
          Histórico recente
        </h2>
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--color-border)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          {history.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '40px 20px', fontSize: '14px', color: 'var(--text-tertiary)', margin: 0 }}>
              Nenhuma solicitação revisada ainda.
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    {['Nome', 'E-mail', 'Status', 'Motivo', 'Revisado em'].map((col, i) => (
                      <th key={i} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid var(--color-border)' }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, index) => (
                    <tr key={item.id} style={{ borderBottom: index < history.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                      <td style={{ padding: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</td>
                      <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{item.email}</td>
                      <td style={{ padding: '16px' }}>
                        {item.status === 'APPROVED' ? (
                          <span style={{ fontSize: '12px', fontWeight: 600, color: '#16a34a', backgroundColor: '#dcfce7', padding: '4px 8px', borderRadius: '6px' }}>
                            Aprovado
                          </span>
                        ) : (
                          <span style={{ fontSize: '12px', fontWeight: 600, color: '#991b1b', backgroundColor: '#fee2e2', padding: '4px 8px', borderRadius: '6px' }}>
                            Rejeitado
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '16px', fontSize: '13px', color: 'var(--text-tertiary)' }}>
                        {item.rejectReason || '—'}
                      </td>
                      <td style={{ padding: '16px', fontSize: '13px', color: 'var(--text-tertiary)' }}>
                        {item.reviewedAt ? new Date(item.reviewedAt).toLocaleString('pt-BR') : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {approveModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '440px', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Aprovar cadastro</h2>
              <button onClick={() => setApproveModal(null)} style={{ background: 'none', border: 'none', fontSize: '18px', color: 'var(--text-tertiary)', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              <div><strong>{approveModal.item.name}</strong></div>
              <div>{approveModal.item.email}</div>
              <div>{approveModal.item.phone}</div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>
                Tipo de usuário
              </label>
              <select
                className="form-input"
                value={approveModal.role}
                onChange={(e) => setApproveModal({ ...approveModal, role: e.target.value as UserRole })}
              >
                <option value="VIEWER">Usuário comum (apenas leitura)</option>
                <option value="EDITOR">Editor (gerencia conteúdo)</option>
                <option value="SUPER_ADMIN">Admin (acesso total)</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setApproveModal(null)}
                style={{ flex: 1, padding: '12px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--color-border)', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmApprove}
                disabled={busyId === approveModal.item.id}
                className="btn-primary"
                style={{ flex: 1, opacity: busyId === approveModal.item.id ? 0.7 : 1 }}
              >
                {busyId === approveModal.item.id ? 'Aprovando…' : 'Aprovar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {rejectModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '440px', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Rejeitar cadastro</h2>
              <button onClick={() => setRejectModal(null)} style={{ background: 'none', border: 'none', fontSize: '18px', color: 'var(--text-tertiary)', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              <div><strong>{rejectModal.item.name}</strong></div>
              <div>{rejectModal.item.email}</div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>
                Motivo (opcional)
              </label>
              <textarea
                className="form-input"
                rows={3}
                value={rejectModal.reason}
                onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
                placeholder="Ex.: e-mail inválido / cadastro duplicado / sem vínculo com a empresa"
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setRejectModal(null)}
                style={{ flex: 1, padding: '12px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--color-border)', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmReject}
                disabled={busyId === rejectModal.item.id}
                style={{ flex: 1, padding: '12px', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', opacity: busyId === rejectModal.item.id ? 0.7 : 1 }}
              >
                {busyId === rejectModal.item.id ? 'Rejeitando…' : 'Rejeitar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
