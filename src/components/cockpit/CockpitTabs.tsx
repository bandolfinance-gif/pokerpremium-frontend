import React from 'react';
import { ELEGANT_FONT as SANS } from '../../styles/elegantTheme';

export type CockpitTab = 'mesa' | 'ia' | 'mesas-ativas' | 'torneios' | 'comunidade' | 'cursos' | 'relatorios' | 'perfil';

interface CockpitTabsProps {
  active: CockpitTab;
  onChange: (tab: CockpitTab) => void;
  onLogout: () => void;
  userRole?: string;
}

const baseTabs: { id: CockpitTab; label: string }[] = [
  { id: 'mesa', label: 'Mesa' },
  { id: 'ia', label: 'Cockpit IA' },
  { id: 'mesas-ativas', label: 'Mesas Ativas' },
  { id: 'torneios', label: 'Torneios' },
  { id: 'comunidade', label: 'Comunidade' },
  { id: 'cursos', label: 'Cursos' },
];

// Cabeçalho da plataforma inteira — mesmo idioma visual do topo da
// Comunidade (barra fixa translúcida, wordmark à esquerda, indicador de
// aba ativa como sublinhado fino em vez de botão-pílula), pra dar uma
// identidade única e consistente ao app inteiro por cima. As TELAS de
// Mesa/Cockpit IA continuam com o visual monospace de HUD por baixo desse
// cabeçalho — essa dualidade (chrome elegante + conteúdo "cockpit de IA"
// nas duas telas centrais) é proposital, não uma inconsistência.
const CockpitTabs: React.FC<CockpitTabsProps> = ({ active, onChange, onLogout, userRole }) => {
  const tabs = [
    ...baseTabs,
    { id: 'relatorios' as CockpitTab, label: 'Relatórios' },
    { id: 'perfil' as CockpitTab, label: 'Perfil' },
  ];

  return (
    <div
      style={{
        flex: '0 0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 14,
        padding: '10px 24px',
        zIndex: 10,
        position: 'relative',
        background: 'linear-gradient(180deg, rgba(4,10,14,0.96), rgba(4,10,14,0.88))',
        borderBottom: '1px solid rgba(0,234,255,0.18)',
        backdropFilter: 'blur(10px)',
        fontFamily: SANS,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <img src="/logo-icon.svg" alt="" style={{ width: 22, height: 22 }} />
        <span style={{ fontWeight: 800, fontSize: 13, letterSpacing: 1, color: '#f4fbff' }}>POKER</span>
        <span
          style={{
            fontFamily: "'Brush Script MT', 'Segoe Script', 'Lucida Handwriting', cursive",
            fontSize: 18,
            background: 'linear-gradient(120deg, #ffd76a 0%, #fff3c4 35%, #00eaff 75%, #7dfbff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Premium
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap', justifyContent: 'center', flex: 1 }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              color: active === tab.id ? '#ffd76a' : 'rgba(232,253,255,0.65)',
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: 12.5,
            }}
          >
            {tab.label}
            <div style={{ width: active === tab.id ? 16 : 0, height: 2, borderRadius: 2, background: '#ffd76a', transition: 'width 0.15s' }} />
          </button>
        ))}
      </div>

      <button
        onClick={onLogout}
        style={{
          flexShrink: 0,
          padding: '6px 14px',
          borderRadius: 20,
          border: '1px solid rgba(255,77,109,0.45)',
          background: 'rgba(255,77,109,0.08)',
          color: '#ff4d6d',
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 12,
          cursor: 'pointer',
        }}
      >
        Sair
      </button>
    </div>
  );
};

export default CockpitTabs;
