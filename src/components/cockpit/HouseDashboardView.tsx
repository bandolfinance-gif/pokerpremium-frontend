import React, { useEffect, useState } from 'react';
import { fetchTables, PokerTableInfo } from '../../services/tablesApi';
import { AffiliatePlayer, fetchMyAffiliates, registerAffiliatePlayer } from '../../services/affiliatesApi';
import ReportsPanel from './ReportsPanel';
import { ELEGANT_FONT as SANS } from '../../styles/elegantTheme';

interface HouseDashboardViewProps {
  userRole: string;
  token: string;
}

const card: React.CSSProperties = {
  padding: '18px 20px',
  borderRadius: 16,
  background: 'linear-gradient(160deg, rgba(0,20,30,0.6), rgba(0,0,0,0.5))',
  border: '1px solid rgba(0,234,255,0.3)',
  boxShadow: '0 0 14px rgba(0,234,255,0.12)',
};

const panel: React.CSSProperties = { ...card, padding: 0, overflow: 'hidden' };
const statLabel: React.CSSProperties = { fontSize: 11, opacity: 0.6, fontWeight: 500 };

const inputStyle: React.CSSProperties = {
  padding: '9px 12px',
  borderRadius: 10,
  border: '1px solid rgba(0,234,255,0.35)',
  background: 'rgba(0,0,0,0.3)',
  color: '#e8fdff',
  fontFamily: SANS,
  fontSize: 13,
  boxSizing: 'border-box',
};

const btnStyle: React.CSSProperties = {
  padding: '9px 18px',
  borderRadius: 20,
  border: '1px solid #ffd76a',
  background: 'rgba(255,215,106,0.14)',
  color: '#ffd76a',
  fontFamily: SANS,
  fontWeight: 700,
  fontSize: 13,
  cursor: 'pointer',
};

const HouseDashboardView: React.FC<HouseDashboardViewProps> = ({ userRole, token }) => {
  const [tables, setTables] = useState<PokerTableInfo[]>([]);
  const [error, setError] = useState('');

  const [afiliados, setAfiliados] = useState<AffiliatePlayer[]>([]);
  const [novoNome, setNovoNome] = useState('');
  const [novoEmail, setNovoEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [cadastrando, setCadastrando] = useState(false);
  const [afiliadoMsg, setAfiliadoMsg] = useState('');

  const carregarAfiliados = () => {
    fetchMyAffiliates(token).then(setAfiliados).catch(() => {});
  };

  useEffect(() => {
    fetchTables(token).then(setTables).catch(() => setError('Não foi possível carregar suas mesas.'));
    carregarAfiliados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleCadastrarAfiliado = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoNome || !novoEmail || !novaSenha) return;
    setCadastrando(true);
    setAfiliadoMsg('');
    try {
      await registerAffiliatePlayer(token, { name: novoNome, email: novoEmail, password: novaSenha });
      setNovoNome('');
      setNovoEmail('');
      setNovaSenha('');
      setAfiliadoMsg('Jogador cadastrado com sucesso!');
      carregarAfiliados();
    } catch (err: any) {
      setAfiliadoMsg(err?.response?.data?.message || 'Não foi possível cadastrar o jogador.');
    } finally {
      setCadastrando(false);
    }
  };

  const mesasAtivas = tables.filter((t) => t.status === 'ativa').length;
  const somaOwnerCut = tables.reduce((sum, t) => sum + (t.ownerCutPercent ?? 0), 0);
  const mediaOwnerCut = tables.length ? Number((somaOwnerCut / tables.length).toFixed(2)) : 0;
  const somaPlatformCut = tables.reduce((sum, t) => sum + (t.platformCutPercent ?? 0), 0);
  const mediaPlatformCut = tables.length ? Number((somaPlatformCut / tables.length).toFixed(2)) : 0;

  const label = userRole === 'house' ? 'Casa de Poker' : 'Agente';

  return (
    <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', padding: '24px 40px 60px', color: '#e8fdff', fontFamily: SANS, fontSize: 14 }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#ffd76a', marginBottom: 20, textAlign: 'center' }}>
          Painel da {label}
        </div>

        {error && <div style={{ color: '#ff4d6d', fontSize: 13, marginBottom: 14, textAlign: 'center' }}>{error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14, marginBottom: 22 }}>
          <div style={card}>
            <div style={statLabel}>Minhas mesas</div>
            <div style={{ fontSize: 26, fontWeight: 700, marginTop: 5 }}>{tables.length}</div>
          </div>
          <div style={card}>
            <div style={statLabel}>Mesas ativas</div>
            <div style={{ fontSize: 26, fontWeight: 700, marginTop: 5, color: '#7dff9c' }}>{mesasAtivas}</div>
          </div>
          <div style={card}>
            <div style={statLabel}>Meu corte médio</div>
            <div style={{ fontSize: 26, fontWeight: 700, marginTop: 5, color: '#ffd76a' }}>{mediaOwnerCut}%</div>
          </div>
          <div style={card}>
            <div style={statLabel}>Corte PokerPremium</div>
            <div style={{ fontSize: 26, fontWeight: 700, marginTop: 5 }}>{mediaPlatformCut}%</div>
          </div>
        </div>

        <div style={{ ...card, marginBottom: 22, fontSize: 12, color: '#ffd76a', opacity: 0.85, lineHeight: 1.5 }}>
          Valores em R$ aparecem aqui assim que a integração de pagamentos for liberada — por enquanto os cortes são só em % de rake sobre as mesas que você abriu.
        </div>

        <div style={panel}>
          <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(0,234,255,0.25)', fontSize: 13, fontWeight: 700, color: '#00eaff' }}>Minhas mesas</div>
          {tables.length === 0 && <div style={{ padding: 18, fontSize: 13, opacity: 0.6 }}>Você ainda não abriu nenhuma mesa.</div>}
          {tables.map((t, i) => (
            <div key={t.id} style={{ padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, borderTop: i > 0 ? '1px solid rgba(0,234,255,0.1)' : 'none' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{t.nome}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: t.status === 'ativa' ? '#7dff9c' : 'rgba(0,234,255,0.6)' }}>
                  {t.status === 'ativa' ? 'Ativa' : t.status === 'aguardando' ? 'Aguardando' : 'Encerrada'}
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: 12 }}>
                <div>Rake: {t.rakePercent}%</div>
                <div style={{ color: '#ffd76a', fontWeight: 600 }}>Você fica: {t.ownerCutPercent}%</div>
                <div style={{ opacity: 0.6 }}>PokerPremium: {t.platformCutPercent}%</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ ...card, marginTop: 22, marginBottom: 22 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#ffd76a', marginBottom: 4 }}>
            Cadastrar jogador indicado
          </div>
          <div style={{ fontSize: 12, opacity: 0.65, marginBottom: 14, lineHeight: 1.5 }}>
            Cadastre um jogador diretamente — ele fica vinculado a você como indicação, mas continua livre pra jogar em qualquer mesa pública de qualquer casa ou agente. Mesa privada continua exigindo convite aceito, indicado ou não.
          </div>
          <form onSubmit={handleCadastrarAfiliado} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <input style={{ ...inputStyle, flex: '1 1 180px' }} placeholder="Nome" value={novoNome} onChange={(e) => setNovoNome(e.target.value)} required />
            <input style={{ ...inputStyle, flex: '1 1 200px' }} type="email" placeholder="Email" value={novoEmail} onChange={(e) => setNovoEmail(e.target.value)} required />
            <input style={{ ...inputStyle, flex: '1 1 150px' }} type="password" placeholder="Senha provisória" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} required />
            <button type="submit" style={{ ...btnStyle, opacity: cadastrando ? 0.6 : 1 }} disabled={cadastrando}>
              {cadastrando ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>
          {afiliadoMsg && (
            <div style={{ marginTop: 10, fontSize: 12, color: afiliadoMsg.includes('sucesso') ? '#7dff9c' : '#ff4d6d' }}>{afiliadoMsg}</div>
          )}
        </div>

        <div style={panel}>
          <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(0,234,255,0.25)', fontSize: 13, fontWeight: 700, color: '#00eaff' }}>
            Jogadores indicados ({afiliados.length})
          </div>
          {afiliados.length === 0 && <div style={{ padding: 18, fontSize: 13, opacity: 0.6 }}>Você ainda não indicou nenhum jogador.</div>}
          {afiliados.map((a, i) => {
            const online = a.lastActiveAt ? Date.now() - new Date(a.lastActiveAt).getTime() < 3 * 60 * 1000 : false;
            return (
              <div key={a.id} style={{ padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, borderTop: i > 0 ? '1px solid rgba(0,234,255,0.1)' : 'none' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{a.name}</div>
                  <div style={{ fontSize: 11, opacity: 0.55 }}>{a.email}</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: 12 }}>
                  <div style={{ color: online ? '#7dff9c' : 'rgba(232,253,255,0.5)', fontWeight: 600 }}>{online ? 'Online agora' : 'Offline'}</div>
                  <div style={{ opacity: 0.6 }}>{a.chips.toLocaleString('pt-BR')} fichas</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ fontSize: 15, fontWeight: 700, color: '#ffd76a', margin: '28px 0 16px', textAlign: 'center' }}>
          Relatórios das minhas mesas
        </div>
        <ReportsPanel token={token} isAdmin={false} />
      </div>
    </div>
  );
};

export default HouseDashboardView;
