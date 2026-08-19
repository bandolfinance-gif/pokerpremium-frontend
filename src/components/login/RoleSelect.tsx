import React from 'react';
import { UserRole } from '../../services/authApi';

interface RoleOption {
  role: UserRole;
  icon: string;
  title: string;
  description: string;
  accent: string;
  accentSoft: string;
}

export const ROLE_THEME: Record<UserRole, { accent: string; accentSoft: string; icon: string; label: string }> = {
  player: { accent: '#00eaff', accentSoft: 'rgba(0,234,255,0.14)', icon: '🎮', label: 'Jogador' },
  house: { accent: '#ffd76a', accentSoft: 'rgba(255,215,106,0.14)', icon: '🏛️', label: 'Casa de Poker' },
  agent: { accent: '#ff6fae', accentSoft: 'rgba(255,111,174,0.14)', icon: '🤝', label: 'Agente de Poker' },
  admin: { accent: '#c084fc', accentSoft: 'rgba(192,132,252,0.14)', icon: '🛡️', label: 'Admin' },
};

const OPTIONS: RoleOption[] = [
  {
    role: 'player',
    icon: '🎮',
    title: 'Jogador',
    description: 'Jogue Texas Hold\'em real, evolua com a IA da mesa e dispute torneios.',
    accent: ROLE_THEME.player.accent,
    accentSoft: ROLE_THEME.player.accentSoft,
  },
  {
    role: 'house',
    icon: '🏛️',
    title: 'Casa de Poker',
    description: 'Hospede mesas, defina o rake e acompanhe seus jogadores em tempo real.',
    accent: ROLE_THEME.house.accent,
    accentSoft: ROLE_THEME.house.accentSoft,
  },
  {
    role: 'agent',
    icon: '🤝',
    title: 'Agente de Poker',
    description: 'Gerencie grupos de jogadores, acompanhe performance e sugira treinos.',
    accent: ROLE_THEME.agent.accent,
    accentSoft: ROLE_THEME.agent.accentSoft,
  },
];

interface RoleSelectProps {
  onSelect: (role: UserRole) => void;
  onBack: () => void;
}

// Tela de escolha de papel antes do cadastro — cada papel abre um
// formulário com tema visual próprio (cor de destaque, ícone, texto),
// em vez de um único formulário genérico com um <select> escondendo a
// diferença entre os 3 tipos de conta. Admin não aparece aqui de propósito
// — cadastro de admin não é self-service por segurança, é provisionado à
// parte.
const RoleSelect: React.FC<RoleSelectProps> = ({ onSelect, onBack }) => {
  return (
    <div className="login-wrapper">
      <div className="role-select-card">
        <img src="/logo-icon.svg" alt="PokerPremium" className="login-badge" />
        <div className="login-logo">
          <span className="login-logo-poker">POKER</span>
          <span className="login-logo-premium">Premium</span>
        </div>
        <div className="role-select-title">Como você quer entrar?</div>

        <div className="role-select-grid">
          {OPTIONS.map((opt) => (
            <button
              key={opt.role}
              className="role-select-option"
              style={{ '--accent': opt.accent, '--accent-soft': opt.accentSoft } as React.CSSProperties}
              onClick={() => onSelect(opt.role)}
            >
              <span className="role-select-icon">{opt.icon}</span>
              <span className="role-select-option-title">{opt.title}</span>
              <span className="role-select-option-desc">{opt.description}</span>
            </button>
          ))}
        </div>

        <div className="login-footer">
          <span className="login-link" onClick={onBack}>← Voltar pro login</span>
        </div>
      </div>
    </div>
  );
};

export default RoleSelect;
