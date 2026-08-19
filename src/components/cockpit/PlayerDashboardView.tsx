import React, { useEffect, useState } from 'react';
import { CursoResumo, fetchCursos } from '../../services/cursosApi';
import { achievements, items, ranking, rarityColor } from './communityDemoData';
import { ELEGANT_FONT as SANS } from '../../styles/elegantTheme';

interface PlayerDashboardViewProps {
  userName: string;
  token: string;
}

const card: React.CSSProperties = {
  padding: '18px 20px',
  borderRadius: 16,
  background: 'linear-gradient(160deg, rgba(0,20,30,0.6), rgba(0,0,0,0.5))',
  border: '1px solid rgba(0,234,255,0.3)',
  boxShadow: '0 0 14px rgba(0,234,255,0.12)',
};

const panel: React.CSSProperties = { ...card };
const sectionLabel: React.CSSProperties = { color: '#00eaff', marginBottom: 10, fontSize: 13, fontWeight: 700 };
const statLabel: React.CSSProperties = { fontSize: 11, opacity: 0.6, fontWeight: 500 };

const PlayerDashboardView: React.FC<PlayerDashboardViewProps> = ({ userName, token }) => {
  const [cursos, setCursos] = useState<CursoResumo[]>([]);

  useEffect(() => {
    fetchCursos(token).then(setCursos).catch(() => {});
  }, [token]);

  const meIndex = ranking.findIndex((p) => p.nome === userName);
  const posicao = meIndex >= 0 ? meIndex + 1 : null;
  const conquistasGanhas = achievements.filter((a) => a.conquistado).length;
  const cursosConcluidos = cursos.filter((c) => c.progresso >= 100).length;
  const progressoMedio = cursos.length
    ? Math.round(cursos.reduce((sum, c) => sum + c.progresso, 0) / cursos.length)
    : 0;

  return (
    <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', padding: '24px 40px 60px', color: '#e8fdff', fontFamily: SANS, fontSize: 14 }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#ffd76a', marginBottom: 20, textAlign: 'center' }}>
          Painel do Jogador — {userName}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14, marginBottom: 22 }}>
          <div style={card}>
            <div style={statLabel}>Posição no ranking</div>
            <div style={{ fontSize: 26, fontWeight: 700, marginTop: 5, color: '#ffd76a' }}>{posicao ? `#${posicao}` : '—'}</div>
          </div>
          <div style={card}>
            <div style={statLabel}>Conquistas</div>
            <div style={{ fontSize: 26, fontWeight: 700, marginTop: 5 }}>{conquistasGanhas}/{achievements.length}</div>
          </div>
          <div style={card}>
            <div style={statLabel}>Cursos concluídos</div>
            <div style={{ fontSize: 26, fontWeight: 700, marginTop: 5, color: '#7dff9c' }}>{cursosConcluidos}/{cursos.length}</div>
          </div>
          <div style={card}>
            <div style={statLabel}>Progresso médio</div>
            <div style={{ fontSize: 26, fontWeight: 700, marginTop: 5 }}>{progressoMedio}%</div>
          </div>
        </div>

        <div style={{ ...card, marginBottom: 22, fontSize: 12, color: '#ffd76a', opacity: 0.85, lineHeight: 1.5 }}>
          Torneios, "mesa atual" e histórico de partidas aparecem aqui assim que o sistema de torneios/histórico de mãos for implementado. Ranking e coleção de itens ainda são dados de demonstração — conquistas já são reais (ver aba Comunidade).
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 22 }}>
          <div style={panel}>
            <div style={sectionLabel}>Ranking global</div>
            {ranking.map((p, i) => {
              const isMe = p.nome === userName;
              return (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', borderRadius: 10, background: isMe ? 'rgba(255,215,106,0.12)' : 'transparent', fontSize: 13 }}>
                  <span style={{ color: isMe ? '#ffd76a' : i === 0 ? '#ffd76a' : '#e8fdff', fontWeight: isMe ? 600 : 400 }}>{i + 1}. {p.nome}{isMe ? ' (você)' : ''}</span>
                  <span style={{ color: '#ffd76a', fontWeight: 600 }}>{p.vitorias}V · {p.desempenho}%</span>
                </div>
              );
            })}
          </div>

          <div style={panel}>
            <div style={sectionLabel}>Conquistas</div>
            {achievements.map((a) => (
              <div key={a.id} style={{ display: 'flex', gap: 8, padding: '5px 0', opacity: a.conquistado ? 1 : 0.4, fontSize: 13 }}>
                <span>{a.icone}</span>
                <div>{a.titulo}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...panel, marginBottom: 22 }}>
          <div style={sectionLabel}>Meus cursos</div>
          {cursos.map((c) => (
            <div key={c.id} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span>{c.titulo}</span>
                <span style={{ opacity: 0.65 }}>{c.progresso}%</span>
              </div>
              <div style={{ background: 'rgba(0,234,255,0.1)', borderRadius: 8, height: 6, overflow: 'hidden', marginTop: 4 }}>
                <div style={{ width: `${c.progresso}%`, height: '100%', background: c.progresso >= 100 ? '#ffd76a' : '#00eaff' }} />
              </div>
            </div>
          ))}
        </div>

        <div style={panel}>
          <div style={sectionLabel}>Coleção de itens</div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {items.map((item) => {
              const color = rarityColor[item.raridade] ?? '#8fa3ad';
              return (
                <div key={item.id} style={{ width: 104, padding: 10, borderRadius: 12, textAlign: 'center', border: `1px solid ${color}`, background: `${color}1a`, opacity: item.obtido ? 1 : 0.35, fontSize: 12 }}>
                  <div style={{ fontSize: 20 }}>{item.icone}</div>
                  <div style={{ marginTop: 3, fontWeight: 600 }}>{item.nome}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerDashboardView;
