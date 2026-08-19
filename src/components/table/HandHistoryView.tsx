import React, { useEffect, useState } from 'react';
import Card from './Card';
import FairnessVerify from './FairnessVerify';
import { fetchHandHistory, HandHistoryEntry } from '../../services/handHistoryApi';

interface HandHistoryViewProps {
  token: string;
  tableId: string;
  onClose: () => void;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });

// Histórico real de mãos jogadas nesta mesa — não um resumo, as cartas de
// verdade de cada jogador e do board, com o mesmo botão de auditoria da
// mesa ao vivo (cada mão guarda sua própria seed revelada).
const HandHistoryView: React.FC<HandHistoryViewProps> = ({ token, tableId, onClose }) => {
  const [hands, setHands] = useState<HandHistoryEntry[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHandHistory(token, tableId)
      .then(setHands)
      .catch(() => setError('Não foi possível carregar o histórico.'));
  }, [token, tableId]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 460,
          maxHeight: '80vh',
          overflowY: 'auto',
          padding: 16,
          borderRadius: 12,
          background: '#05070a',
          border: '1px solid #00eaff',
          boxShadow: '0 0 30px rgba(0,234,255,0.3)',
          color: '#e8fdff',
          fontFamily: 'monospace',
          fontSize: 12,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ color: '#ffd76a', letterSpacing: 1 }}>HISTÓRICO DE MÃOS</div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#00eaff', cursor: 'pointer', fontSize: 16 }}
          >
            ×
          </button>
        </div>

        {error && <div style={{ color: '#ff4d6d' }}>{error}</div>}
        {!error && hands.length === 0 && <div style={{ opacity: 0.6 }}>Nenhuma mão registrada nesta mesa ainda.</div>}

        {hands.map((h) => (
          <div
            key={h._id}
            style={{
              marginBottom: 8,
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid rgba(0,234,255,0.25)',
              background: 'rgba(0,234,255,0.04)',
            }}
          >
            <div
              style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}
              onClick={() => setExpanded(expanded === h._id ? null : h._id)}
            >
              <span style={{ opacity: 0.6 }}>{formatDate(h.createdAt)}</span>
              <span style={{ color: '#7dff9c' }}>
                {h.players.find((p) => h.winners.includes(p.id))?.name ?? '—'}
                {h.handName ? ` (${h.handName})` : h.wonByFold ? ' (desistência)' : ''} · POT {h.pot}
              </span>
            </div>

            {expanded === h._id && (
              <div style={{ marginTop: 8, position: 'relative', paddingBottom: 18 }}>
                {h.communityCards.length > 0 && (
                  <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
                    {h.communityCards.map((c, i) => (
                      <Card key={i} card={c} width={28} height={38} />
                    ))}
                  </div>
                )}
                {h.players.map((p) => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, opacity: p.folded ? 0.5 : 1 }}>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {p.holeCards.map((c, i) => (
                        <Card key={i} card={c} width={22} height={30} />
                      ))}
                    </div>
                    <span>
                      {p.name} {p.folded ? '(desistiu)' : ''} — ficou com {p.endStack}
                    </span>
                  </div>
                ))}
                {h.rakeCollected > 0 && (
                  <div style={{ opacity: 0.6, marginTop: 4 }}>Rake da casa: {h.rakeCollected}</div>
                )}
                <FairnessVerify
                  hand={{
                    serverSeed: h.serverSeed,
                    serverSeedHash: h.serverSeedHash,
                    communityCards: h.communityCards,
                    players: h.players,
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HandHistoryView;
