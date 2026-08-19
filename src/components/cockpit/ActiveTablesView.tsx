import React, { useEffect, useState } from 'react';
import { createTable, fetchTables, inviteToTable, PokerTableInfo, TableVisibility } from '../../services/tablesApi';
import { ELEGANT_FONT as SANS } from '../../styles/elegantTheme';

interface ActiveTablesViewProps {
  userRole: string;
  userId: string;
  token: string;
  onJoinTable: (tableId: string) => void;
}

const canOpenTable = (role: string) => role === 'house' || role === 'agent';
const seesFinancials = (role: string) => role === 'admin' || canOpenTable(role);

const inputStyle: React.CSSProperties = {
  background: 'rgba(0,0,0,0.3)',
  border: '1px solid rgba(0,234,255,0.35)',
  borderRadius: 10,
  color: '#e8fdff',
  padding: '8px 12px',
  fontFamily: SANS,
  fontSize: 13,
};

const ActiveTablesView: React.FC<ActiveTablesViewProps> = ({ userRole, userId, token, onJoinTable }) => {
  const [tables, setTables] = useState<PokerTableInfo[]>([]);
  const [error, setError] = useState('');
  const [nome, setNome] = useState('');
  const [rake, setRake] = useState(5);
  const [visibilidade, setVisibilidade] = useState<TableVisibility>('publica');
  const [inviteDrafts, setInviteDrafts] = useState<Record<string, string>>({});

  const load = () => {
    fetchTables(token)
      .then(setTables)
      .catch(() => setError('Não foi possível carregar as mesas.'));
  };

  useEffect(load, [token]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;
    try {
      await createTable(token, nome.trim(), rake, visibilidade);
      setNome('');
      load();
    } catch {
      setError('Não foi possível abrir a mesa.');
    }
  };

  const handleInvite = async (tableId: string) => {
    const email = inviteDrafts[tableId]?.trim();
    if (!email) return;
    try {
      await inviteToTable(token, tableId, email);
      setInviteDrafts((prev) => ({ ...prev, [tableId]: '' }));
      load();
    } catch (err) {
      setError('Não foi possível convidar — confira o email.');
    }
  };

  const canJoin = (table: PokerTableInfo) => {
    // Mesa pública: qualquer um entra. Privada: só se aparece na lista
    // pra esse usuário (o backend já filtra — só mostra privadas em que
    // ele foi convidado, ou que ele é dono/admin).
    return true;
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflowY: 'auto',
        padding: '24px 40px 60px',
        color: '#e8fdff',
        fontFamily: SANS,
        fontSize: 14,
      }}
    >
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        {userRole === 'admin' && (
          <div style={{ fontSize: 12, textAlign: 'center', color: '#ffd76a', marginBottom: 14 }}>
            Visão de administrador — todas as mesas da plataforma, com o lucro de cada uma.
          </div>
        )}

        {canOpenTable(userRole) && (
          <form
            onSubmit={handleCreate}
            style={{
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
              marginBottom: 20,
              padding: 16,
              border: '1px solid rgba(0,234,255,0.3)',
              borderRadius: 16,
              background: 'linear-gradient(160deg, rgba(0,20,30,0.6), rgba(0,0,0,0.5))',
            }}
          >
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome da mesa"
              style={{ ...inputStyle, flex: 1, minWidth: 140 }}
            />
            <input
              type="number"
              min={0}
              max={100}
              value={rake}
              onChange={(e) => setRake(Number(e.target.value))}
              style={{ ...inputStyle, width: 70 }}
            />
            <span style={{ alignSelf: 'center', fontSize: 13, opacity: 0.65 }}>% rake</span>
            <select
              value={visibilidade}
              onChange={(e) => setVisibilidade(e.target.value as TableVisibility)}
              style={{ ...inputStyle, background: '#05070a' }}
            >
              <option value="publica">Pública</option>
              <option value="privada">Privada (por convite)</option>
            </select>
            <button
              type="submit"
              style={{ padding: '8px 18px', borderRadius: 20, border: '1px solid #ffd76a', background: 'rgba(255,215,106,0.15)', color: '#ffd76a', fontFamily: SANS, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
            >
              Abrir mesa
            </button>
          </form>
        )}

        {error && <div style={{ color: '#ff4d6d', fontSize: 13, marginBottom: 14 }}>{error}</div>}
        {tables.length === 0 && !error && (
          <div style={{ opacity: 0.55, textAlign: 'center', fontSize: 13 }}>Nenhuma mesa aberta ainda.</div>
        )}

        {tables.map((table) => {
          const isOwner = canOpenTable(userRole) && table.ownerId === userId;
          return (
            <div
              key={table.id}
              style={{
                padding: '16px 18px',
                marginBottom: 12,
                borderRadius: 16,
                background: 'linear-gradient(160deg, rgba(0,20,30,0.55), rgba(0,0,0,0.5))',
                border: '1px solid rgba(0,234,255,0.3)',
                boxShadow: '0 0 12px rgba(0,234,255,0.12)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#f2fbff' }}>
                    {table.nome}{' '}
                    <span style={{ fontSize: 11, fontWeight: 600, color: table.visibilidade === 'privada' ? '#ff6fae' : '#7dff9c', opacity: 0.9 }}>
                      {table.visibilidade === 'privada' ? '🔒 Privada' : '🌐 Pública'}
                    </span>
                    {table.vocEstaNela && (
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#ffd76a', marginLeft: 8 }}>● Você está online nela</span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: table.status === 'ativa' ? '#7dff9c' : 'rgba(0,234,255,0.65)' }}>
                    {table.status === 'ativa' ? 'Ativa' : table.status === 'aguardando' ? 'Aguardando' : 'Encerrada'}
                    {table.jogadoresSentados !== undefined && (
                      <span style={{ opacity: 0.7, fontWeight: 500 }}> · {table.jogadoresSentados}/{table.maxJogadores} jogadores sentados</span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  {seesFinancials(userRole) && table.rakePercent !== undefined && (
                    <div style={{ textAlign: 'right', fontSize: 12 }}>
                      <div>Rake: {table.rakePercent}%</div>
                      <div style={{ color: '#ffd76a', fontWeight: 600 }}>PokerPremium: {table.platformCutPercent}%</div>
                      <div style={{ opacity: 0.65 }}>{table.ownerRole === 'house' ? 'Casa' : 'Agente'}: {table.ownerCutPercent}%</div>
                    </div>
                  )}
                  {canJoin(table) && (
                    <button
                      onClick={() => onJoinTable(table.id)}
                      style={{ padding: '7px 18px', borderRadius: 20, border: '1px solid #00eaff', background: 'rgba(0,234,255,0.15)', color: '#00eaff', fontFamily: SANS, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
                    >
                      Entrar
                    </button>
                  )}
                </div>
              </div>

              {isOwner && table.visibilidade === 'privada' && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(0,234,255,0.15)' }}>
                  <div style={{ fontSize: 11, opacity: 0.65, marginBottom: 8 }}>
                    Convidados: {table.convidados && table.convidados.length > 0
                      ? table.convidados.map((c) => c.name || c.email).join(', ')
                      : 'nenhum ainda'}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      value={inviteDrafts[table.id] ?? ''}
                      onChange={(e) => setInviteDrafts((prev) => ({ ...prev, [table.id]: e.target.value }))}
                      placeholder="email do jogador"
                      style={{ ...inputStyle, flex: 1, padding: '6px 12px', fontSize: 12 }}
                    />
                    <button
                      onClick={() => handleInvite(table.id)}
                      style={{ padding: '6px 14px', borderRadius: 16, border: '1px solid #ffd76a', background: 'rgba(255,215,106,0.12)', color: '#ffd76a', fontFamily: SANS, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
                    >
                      Convidar
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActiveTablesView;
