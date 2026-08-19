import React, { useEffect, useState } from 'react';
import { fetchReport, fetchReportFiltros, Periodo, Report, ReportFiltros } from '../../services/reportsApi';
import { ELEGANT_FONT as SANS } from '../../styles/elegantTheme';

interface ReportsPanelProps {
  token: string;
  isAdmin: boolean;
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
const panelHeader: React.CSSProperties = { padding: '12px 18px', borderBottom: '1px solid rgba(0,234,255,0.25)', fontSize: 13, fontWeight: 700, color: '#00eaff' };

const selectStyle: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: 10,
  border: '1px solid rgba(0,234,255,0.35)',
  background: 'rgba(0,0,0,0.35)',
  color: '#e8fdff',
  fontFamily: SANS,
  fontSize: 12,
};

const PERIODOS: { value: Periodo; label: string }[] = [
  { value: 'diario', label: 'Diário' },
  { value: 'semanal', label: 'Semanal' },
  { value: 'quinzenal', label: 'Quinzenal' },
  { value: 'mensal', label: 'Mensal' },
  { value: 'personalizado', label: 'Data específica' },
];

const todayISO = () => new Date().toISOString().slice(0, 10);
const formatMoeda = (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const formatData = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString('pt-BR') : '—');
const formatDataHora = (iso: string | null) => (iso ? new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—');

// Painel de relatórios reutilizado por admin (vê tudo, filtra por
// casa/agente/jogador) e por casa/agente (mesma UI, mas o backend força o
// escopo aos próprios dados — nunca manda ownerId de outro dono).
const ReportsPanel: React.FC<ReportsPanelProps> = ({ token, isAdmin }) => {
  const [periodo, setPeriodo] = useState<Periodo>('diario');
  const [data, setData] = useState(todayISO());
  const [dataInicio, setDataInicio] = useState(todayISO());
  const [dataFim, setDataFim] = useState(todayISO());
  const [ownerId, setOwnerId] = useState('');
  const [jogadorId, setJogadorId] = useState('');

  const [filtros, setFiltros] = useState<ReportFiltros | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAdmin) {
      fetchReportFiltros(token).then(setFiltros).catch(() => {});
    }
  }, [token, isAdmin]);

  useEffect(() => {
    setLoading(true);
    setError('');
    fetchReport(token, {
      periodo,
      data: periodo === 'personalizado' ? undefined : data,
      dataInicio: periodo === 'personalizado' ? dataInicio : undefined,
      dataFim: periodo === 'personalizado' ? dataFim : undefined,
      ownerId: isAdmin && ownerId ? ownerId : undefined,
      jogadorId: isAdmin && jogadorId ? jogadorId : undefined,
    })
      .then(setReport)
      .catch(() => setError('Não foi possível carregar o relatório.'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, periodo, data, dataInicio, dataFim, ownerId, jogadorId, isAdmin]);

  return (
    <div>
      <div style={{ ...card, marginBottom: 22, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {PERIODOS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriodo(p.value)}
              style={{
                padding: '7px 14px',
                borderRadius: 20,
                border: `1px solid ${periodo === p.value ? '#00eaff' : 'rgba(0,234,255,0.25)'}`,
                background: periodo === p.value ? 'rgba(0,234,255,0.18)' : 'transparent',
                color: periodo === p.value ? '#00eaff' : 'rgba(232,253,255,0.7)',
                fontFamily: SANS,
                fontWeight: 600,
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {periodo === 'personalizado' ? (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} style={selectStyle} />
            <span style={{ opacity: 0.5, fontSize: 12 }}>até</span>
            <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} style={selectStyle} />
          </div>
        ) : (
          <input type="date" value={data} onChange={(e) => setData(e.target.value)} style={selectStyle} />
        )}

        {isAdmin && (
          <>
            <select value={ownerId} onChange={(e) => setOwnerId(e.target.value)} style={selectStyle}>
              <option value="">Todas as casas/agentes</option>
              {filtros?.donos.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.role === 'house' ? 'Casa' : 'Agente'})
                </option>
              ))}
            </select>
            <select value={jogadorId} onChange={(e) => setJogadorId(e.target.value)} style={selectStyle}>
              <option value="">Todos os jogadores</option>
              {filtros?.jogadores.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.name}
                </option>
              ))}
            </select>
          </>
        )}
      </div>

      {error && <div style={{ color: '#ff4d6d', fontSize: 13, marginBottom: 14, textAlign: 'center' }}>{error}</div>}
      {loading && !report && <div style={{ textAlign: 'center', fontSize: 13, opacity: 0.6, marginBottom: 14 }}>Carregando relatório...</div>}

      {report && (
        <>
          <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 10 }}>
            Período: {formatData(report.periodo.inicio)} até {formatData(report.periodo.fim)}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14, marginBottom: 22 }}>
            <div style={card}>
              <div style={statLabel}>Mesas</div>
              <div style={{ fontSize: 24, fontWeight: 700, marginTop: 5 }}>{report.resumo.totalMesas}</div>
            </div>
            <div style={card}>
              <div style={statLabel}>Mesas ativas</div>
              <div style={{ fontSize: 24, fontWeight: 700, marginTop: 5, color: '#7dff9c' }}>{report.resumo.mesasAtivas}</div>
            </div>
            <div style={card}>
              <div style={statLabel}>Mãos jogadas</div>
              <div style={{ fontSize: 24, fontWeight: 700, marginTop: 5 }}>{report.resumo.totalMaos}</div>
            </div>
            <div style={card}>
              <div style={statLabel}>Torneios</div>
              <div style={{ fontSize: 24, fontWeight: 700, marginTop: 5 }}>{report.resumo.totalTorneios}</div>
            </div>
            <div style={card}>
              <div style={statLabel}>Pote movimentado</div>
              <div style={{ fontSize: 20, fontWeight: 700, marginTop: 5 }}>{formatMoeda(report.resumo.potTotal)}</div>
            </div>
            <div style={card}>
              <div style={statLabel}>Rake coletado</div>
              <div style={{ fontSize: 20, fontWeight: 700, marginTop: 5, color: '#ffd76a' }}>{formatMoeda(report.resumo.rakeTotal)}</div>
            </div>
            <div style={card}>
              <div style={statLabel}>{isAdmin ? 'Corte PokerPremium' : 'Corte PokerPremium'}</div>
              <div style={{ fontSize: 20, fontWeight: 700, marginTop: 5 }}>{formatMoeda(report.resumo.platformCutTotal)}</div>
            </div>
            <div style={card}>
              <div style={statLabel}>{isAdmin ? 'Corte dos donos' : 'Seu corte'}</div>
              <div style={{ fontSize: 20, fontWeight: 700, marginTop: 5, color: '#7dff9c' }}>{formatMoeda(report.resumo.ownerCutTotal)}</div>
            </div>
          </div>

          <div style={{ ...panel, marginBottom: 22 }}>
            <div style={panelHeader}>Mesas no período ({report.mesas.length})</div>
            {report.mesas.length === 0 && <div style={{ padding: 18, fontSize: 13, opacity: 0.6 }}>Nenhuma mesa no escopo selecionado.</div>}
            {report.mesas.map((m, i) => (
              <div key={m.id} style={{ padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, borderTop: i > 0 ? '1px solid rgba(0,234,255,0.1)' : 'none', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ fontWeight: 600 }}>
                    {m.nome}
                    {isAdmin && m.dono && <span style={{ opacity: 0.5, fontSize: 11, fontWeight: 400 }}> — {m.dono.name} ({m.dono.role === 'house' ? 'Casa' : 'Agente'})</span>}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: m.status === 'ativa' ? '#7dff9c' : 'rgba(0,234,255,0.6)' }}>
                    {m.status === 'ativa' ? 'Ativa' : m.status === 'aguardando' ? 'Aguardando' : 'Encerrada'} · última mão: {formatDataHora(m.ultimaMao)}
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: 12 }}>
                  <div>{m.maos} mãos · pote {formatMoeda(m.potTotal)}</div>
                  <div style={{ color: '#ffd76a', fontWeight: 600 }}>Rake: {formatMoeda(m.rakeTotal)} ({m.rakePercent}%)</div>
                  <div style={{ opacity: 0.6 }}>Dono: {formatMoeda(m.ownerCut)} · PokerPremium: {formatMoeda(m.platformCut)}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={panel}>
            <div style={panelHeader}>Torneios no período ({report.torneios.length})</div>
            {report.torneios.length === 0 && <div style={{ padding: 18, fontSize: 13, opacity: 0.6 }}>Nenhum torneio no escopo selecionado.</div>}
            {report.torneios.map((t, i) => (
              <div key={t.id} style={{ padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, borderTop: i > 0 ? '1px solid rgba(0,234,255,0.1)' : 'none', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ fontWeight: 600 }}>
                    {t.nome}
                    {isAdmin && t.dono && <span style={{ opacity: 0.5, fontSize: 11, fontWeight: 400 }}> — {t.dono.name}</span>}
                  </div>
                  <div style={{ fontSize: 11, opacity: 0.6 }}>{t.jogadores} jogadores · finalizado: {formatDataHora(t.finishedAt)}</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: 12 }}>
                  <div>Buy-in: {formatMoeda(t.buyIn)}</div>
                  <div style={{ color: '#ffd76a', fontWeight: 600 }}>Prêmio: {formatMoeda(t.prizePool)}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ReportsPanel;
