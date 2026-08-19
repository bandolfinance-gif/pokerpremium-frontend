import React, { useEffect, useState } from 'react';
import {
  createTournament,
  fetchTournaments,
  registerForTournament,
  startTournament,
  TournamentInfo,
} from '../../services/tournamentsApi';
import { ELEGANT_FONT as SANS } from '../../styles/elegantTheme';

interface TournamentsViewProps {
  userRole: string;
  userId: string;
  token: string;
  onJoinTournament: (tournamentId: string) => void;
}

const canCreate = (role: string) => role === 'house' || role === 'agent' || role === 'admin';

const statusLabel: Record<string, { text: string; color: string }> = {
  aguardando: { text: 'Aguardando', color: '#ffd76a' },
  rodando: { text: 'Rodando', color: '#7dff9c' },
  encerrado: { text: 'Encerrado', color: 'rgba(0,234,255,0.5)' },
};

const card: React.CSSProperties = {
  padding: '16px 18px',
  marginBottom: 12,
  borderRadius: 16,
  background: 'linear-gradient(160deg, rgba(0,20,30,0.55), rgba(0,0,0,0.5))',
  border: '1px solid rgba(0,234,255,0.3)',
  boxShadow: '0 0 12px rgba(0,234,255,0.12)',
};

const inputStyle: React.CSSProperties = {
  background: 'rgba(0,0,0,0.3)',
  border: '1px solid rgba(0,234,255,0.35)',
  borderRadius: 10,
  color: '#e8fdff',
  padding: '8px 12px',
  fontFamily: SANS,
  fontSize: 13,
};

const pillBtn = (accent: string, soft: string): React.CSSProperties => ({
  padding: '7px 18px',
  borderRadius: 20,
  border: `1px solid ${accent}`,
  background: soft,
  color: accent,
  fontFamily: SANS,
  fontWeight: 700,
  fontSize: 12,
  cursor: 'pointer',
});

// Sit & Go de mesa única: casa/agente/admin cria com entrada e nº máximo
// de jogadores, todo mundo paga a mesma entrada, cegas sobem com o
// tempo, quem zera as fichas sai, e o pote de prêmios (soma das
// entradas) vai pros melhores colocados quando só sobra 1 — tudo em
// fichas de prática, nunca dinheiro real.
const TournamentsView: React.FC<TournamentsViewProps> = ({ userRole, userId, token, onJoinTournament }) => {
  const [tournaments, setTournaments] = useState<TournamentInfo[]>([]);
  const [error, setError] = useState('');
  const [nome, setNome] = useState('');
  const [buyIn, setBuyIn] = useState(50);
  const [maxPlayers, setMaxPlayers] = useState(6);

  const load = () => {
    fetchTournaments(token)
      .then(setTournaments)
      .catch(() => setError('Não foi possível carregar os torneios.'));
  };

  useEffect(load, [token]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;
    try {
      await createTournament(token, nome.trim(), buyIn, maxPlayers);
      setNome('');
      load();
    } catch {
      setError('Não foi possível criar o torneio.');
    }
  };

  const handleRegister = async (id: string) => {
    try {
      await registerForTournament(token, id);
      load();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Não foi possível se inscrever.');
    }
  };

  const handleStart = async (id: string) => {
    try {
      await startTournament(token, id);
      load();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Não foi possível iniciar.');
    }
  };

  return (
    <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', padding: '24px 40px 60px', color: '#e8fdff', fontFamily: SANS, fontSize: 14 }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        {canCreate(userRole) && (
          <form
            onSubmit={handleCreate}
            style={{ ...card, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}
          >
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome do torneio"
              style={{ ...inputStyle, flex: 1, minWidth: 140 }}
            />
            <input
              type="number"
              min={1}
              value={buyIn}
              onChange={(e) => setBuyIn(Number(e.target.value))}
              style={{ ...inputStyle, width: 80 }}
            />
            <span style={{ fontSize: 12, opacity: 0.65 }}>entrada</span>
            <input
              type="number"
              min={2}
              max={9}
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(Number(e.target.value))}
              style={{ ...inputStyle, width: 60 }}
            />
            <span style={{ fontSize: 12, opacity: 0.65 }}>jogadores</span>
            <button type="submit" style={pillBtn('#ffd76a', 'rgba(255,215,106,0.15)')}>
              Criar torneio
            </button>
          </form>
        )}

        {error && <div style={{ color: '#ff4d6d', fontSize: 13, marginBottom: 14 }}>{error}</div>}
        {tournaments.length === 0 && !error && (
          <div style={{ opacity: 0.55, textAlign: 'center', fontSize: 13 }}>Nenhum torneio criado ainda.</div>
        )}

        {tournaments.map((t) => {
          const isRegistered = t.registeredPlayers.some((p) => p.userId === userId);
          const isOwner = t.ownerId === userId;
          const winner = t.results?.find((r) => r.position === 1);
          const status = statusLabel[t.status];

          return (
            <div key={t.id} style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#f2fbff' }}>{t.nome}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: status.color }}>{status.text}</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: 12 }}>
                  <div>Entrada: {t.buyIn}</div>
                  <div>{t.registeredCount}/{t.maxPlayers} inscritos</div>
                  <div style={{ color: '#ffd76a', fontWeight: 600 }}>Prêmio: {t.prizePool}</div>
                </div>
              </div>

              {t.status === 'encerrado' && winner && (
                <div style={{ marginTop: 10, fontSize: 12, color: '#7dff9c' }}>
                  🏆 {winner.name} venceu — levou {winner.prize} fichas
                </div>
              )}

              <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                {t.status === 'aguardando' && !isRegistered && (
                  <button onClick={() => handleRegister(t.id)} style={pillBtn('#00eaff', 'rgba(0,234,255,0.15)')}>
                    Inscrever-se
                  </button>
                )}
                {t.status === 'aguardando' && isRegistered && (
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#7dff9c', alignSelf: 'center' }}>✔ Inscrito</span>
                )}
                {t.status === 'aguardando' && isOwner && t.registeredCount >= 2 && (
                  <button onClick={() => handleStart(t.id)} style={pillBtn('#ffd76a', 'rgba(255,215,106,0.15)')}>
                    Iniciar
                  </button>
                )}
                {t.status === 'rodando' && isRegistered && (
                  <button onClick={() => onJoinTournament(t.id)} style={pillBtn('#7dff9c', 'rgba(125,255,156,0.12)')}>
                    Entrar na mesa
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TournamentsView;
