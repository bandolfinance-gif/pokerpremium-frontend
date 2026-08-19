import React, { useEffect, useState } from 'react';
import { AdminOverview, fetchAdminOverview, updatePlatformFee } from '../../services/adminApi';
import ReportsPanel from './ReportsPanel';
import { ELEGANT_FONT as SANS } from '../../styles/elegantTheme';

interface AdminDashboardViewProps {
  token: string;
}

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administradores',
  player: 'Jogadores',
  house: 'Casas de Poker',
  agent: 'Agentes',
};

const formatDate = (iso?: string) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
};

const card: React.CSSProperties = {
  padding: '18px 20px',
  borderRadius: 16,
  background: 'linear-gradient(160deg, rgba(0,20,30,0.6), rgba(0,0,0,0.5))',
  border: '1px solid rgba(0,234,255,0.3)',
  boxShadow: '0 0 14px rgba(0,234,255,0.12)',
};

const panel: React.CSSProperties = {
  ...card,
  padding: 0,
  overflow: 'hidden',
};

const statLabel: React.CSSProperties = { fontSize: 11, opacity: 0.6, fontWeight: 500 };
const panelHeader: React.CSSProperties = { padding: '12px 18px', borderBottom: '1px solid rgba(0,234,255,0.25)', fontSize: 13, fontWeight: 700, color: '#00eaff' };

const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ token }) => {
  const [data, setData] = useState<AdminOverview | null>(null);
  const [error, setError] = useState('');
  const [feeDraft, setFeeDraft] = useState<number | null>(null);
  const [savingFee, setSavingFee] = useState(false);

  useEffect(() => {
    fetchAdminOverview(token)
      .then((d) => {
        setData(d);
        setFeeDraft(d.platformFeePercent);
      })
      .catch(() => setError('Não foi possível carregar o painel administrativo.'));
  }, [token]);

  const handleSaveFee = async () => {
    if (feeDraft === null) return;
    setSavingFee(true);
    try {
      const res = await updatePlatformFee(token, feeDraft);
      setData((prev) => (prev ? { ...prev, platformFeePercent: res.platformFeePercent } : prev));
    } catch {
      setError('Não foi possível salvar o corte da plataforma.');
    } finally {
      setSavingFee(false);
    }
  };

  if (error) {
    return <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff4d6d', fontFamily: SANS }}>{error}</div>;
  }

  if (!data) {
    return <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00eaff', fontFamily: SANS }}>Carregando painel...</div>;
  }

  return (
    <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', padding: '24px 40px 60px', color: '#e8fdff', fontFamily: SANS, fontSize: 14 }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#ffd76a', marginBottom: 20, textAlign: 'center' }}>
          Painel Administrativo — PokerPremium
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14, marginBottom: 22 }}>
          <div style={card}>
            <div style={statLabel}>Contas totais</div>
            <div style={{ fontSize: 26, fontWeight: 700, marginTop: 5 }}>{data.totalUsers}</div>
          </div>
          <div style={card}>
            <div style={statLabel}>Mesas ativas</div>
            <div style={{ fontSize: 26, fontWeight: 700, marginTop: 5, color: '#7dff9c' }}>{data.mesasAtivas}</div>
          </div>
          <div style={card}>
            <div style={statLabel}>Mesas totais</div>
            <div style={{ fontSize: 26, fontWeight: 700, marginTop: 5 }}>{data.totalMesas}</div>
          </div>
          <div style={card}>
            <div style={statLabel}>Corte médio PokerPremium</div>
            <div style={{ fontSize: 26, fontWeight: 700, marginTop: 5, color: '#ffd76a' }}>{data.mediaPlatformCutPercent}%</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 22 }}>
          {Object.entries(data.usersByRole).map(([role, count]) => (
            <div key={role} style={{ ...card, padding: '10px 16px', flex: '1 1 140px' }}>
              <div style={statLabel}>{ROLE_LABELS[role] || role}</div>
              <div style={{ fontSize: 19, fontWeight: 700, marginTop: 3 }}>{count}</div>
            </div>
          ))}
        </div>

        <div style={{ ...card, marginBottom: 22, fontSize: 12, color: '#ffd76a', opacity: 0.85, lineHeight: 1.5 }}>
          Receita em R$ e métodos de pagamento aparecem aqui assim que a integração de pagamentos for liberada — números financeiros reais da plataforma (mesas, rake%, corte) já estão ativos acima.
        </div>

        <div style={{ ...card, marginBottom: 22, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 13, opacity: 0.85, lineHeight: 1.5 }}>
            Corte da PokerPremium sobre o rake de cada mesa (padrão 20% — casa/agente definem o próprio rake por mesa, isso aqui é a fatia que a plataforma tira EM CIMA daquele rake):
          </div>
          <input
            type="number"
            min={0}
            max={100}
            value={feeDraft ?? ''}
            onChange={(e) => setFeeDraft(Number(e.target.value))}
            style={{ width: 70, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(0,234,255,0.35)', borderRadius: 10, color: '#e8fdff', padding: '8px 12px', fontFamily: SANS }}
          />
          <span style={{ fontSize: 13, opacity: 0.65 }}>%</span>
          <button
            onClick={handleSaveFee}
            disabled={savingFee || feeDraft === data.platformFeePercent}
            style={{ padding: '8px 18px', borderRadius: 20, border: '1px solid #ffd76a', background: 'rgba(255,215,106,0.15)', color: '#ffd76a', fontFamily: SANS, fontWeight: 700, fontSize: 12, cursor: 'pointer', opacity: savingFee || feeDraft === data.platformFeePercent ? 0.5 : 1 }}
          >
            {savingFee ? 'Salvando...' : 'Salvar'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 22 }}>
          <div style={panel}>
            <div style={panelHeader}>Últimos cadastros</div>
            {data.recentSignups.length === 0 && <div style={{ padding: 18, fontSize: 12, opacity: 0.6 }}>Nenhum cadastro ainda.</div>}
            {data.recentSignups.map((u, i) => (
              <div key={i} style={{ padding: '10px 18px', display: 'flex', justifyContent: 'space-between', fontSize: 12, borderTop: i > 0 ? '1px solid rgba(0,234,255,0.1)' : 'none' }}>
                <span>{u.name} <span style={{ opacity: 0.5 }}>({ROLE_LABELS[u.role] || u.role})</span></span>
                <span style={{ opacity: 0.6 }}>{formatDate(u.createdAt)}</span>
              </div>
            ))}
          </div>

          <div style={panel}>
            <div style={panelHeader}>Últimos acessos</div>
            {data.recentLogins.length === 0 && <div style={{ padding: 18, fontSize: 12, opacity: 0.6 }}>Nenhum acesso registrado ainda.</div>}
            {data.recentLogins.map((u, i) => (
              <div key={i} style={{ padding: '10px 18px', display: 'flex', justifyContent: 'space-between', fontSize: 12, borderTop: i > 0 ? '1px solid rgba(0,234,255,0.1)' : 'none' }}>
                <span>{u.name} <span style={{ opacity: 0.5 }}>({ROLE_LABELS[u.role] || u.role})</span></span>
                <span style={{ opacity: 0.6 }}>{formatDate(u.lastLogin)}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={panel}>
          <div style={panelHeader}>Mesas recentes</div>
          {data.tables.length === 0 && <div style={{ padding: 18, fontSize: 12, opacity: 0.6 }}>Nenhuma mesa aberta ainda.</div>}
          {data.tables.map((t, i) => (
            <div key={t.id} style={{ padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, borderTop: i > 0 ? '1px solid rgba(0,234,255,0.1)' : 'none' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{t.nome} <span style={{ opacity: 0.5, fontSize: 11, fontWeight: 400 }}>({t.ownerRole === 'house' ? 'Casa' : 'Agente'})</span></div>
                <div style={{ fontSize: 11, fontWeight: 600, color: t.status === 'ativa' ? '#7dff9c' : 'rgba(0,234,255,0.6)' }}>
                  {t.status === 'ativa' ? 'Ativa' : t.status === 'aguardando' ? 'Aguardando' : 'Encerrada'}
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: 12 }}>
                <div>Rake: {t.rakePercent}%</div>
                <div style={{ color: '#ffd76a', fontWeight: 600 }}>PokerPremium: {t.platformCutPercent}%</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 15, fontWeight: 700, color: '#ffd76a', margin: '28px 0 16px', textAlign: 'center' }}>
          Relatórios detalhados
        </div>
        <ReportsPanel token={token} isAdmin />
      </div>
    </div>
  );
};

export default AdminDashboardView;
