import React, { useState } from 'react';
import CommunityFeed from './CommunityFeed';
import CommunityMembers from './CommunityMembers';
import CommunityProfile from './CommunityProfile';
import PlayerAvatarRenderer from '../table/PlayerAvatarRenderer';
import { resolveMediaUrl } from '../../services/media';

const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

interface CommunityViewProps {
  userId: string;
  userName: string;
  userAvatarImage: string | null;
  token: string;
}

type CommunityTab = 'feed' | 'membros' | 'perfil';

const initialsOf = (name: string) => name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();

const NavIcon: React.FC<{ active: boolean; onClick: () => void; label: string; children: React.ReactNode }> = ({ active, onClick, label, children }) => (
  <button
    onClick={onClick}
    title={label}
    style={{
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 2,
      color: active ? '#ffd76a' : 'rgba(232,253,255,0.55)',
      padding: '4px 10px',
    }}
  >
    <div style={{ fontSize: 21, filter: active ? 'drop-shadow(0 0 8px rgba(255,215,106,0.6))' : 'none' }}>{children}</div>
    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.3 }}>{label}</div>
    <div style={{ width: active ? 18 : 0, height: 2, borderRadius: 2, background: '#ffd76a', transition: 'width 0.15s' }} />
  </button>
);

// Comunidade real: todo mundo que se cadastra já aparece automaticamente
// (aba Membros), pode seguir/deixar de seguir outros jogadores, publicar
// texto/foto/reel na linha do tempo, e ganha posts automáticos quando
// desbloqueia uma conquista real (calculada a partir de mãos/torneios de
// verdade — ver backend/services/achievements.js). Cabeçalho estilo
// rede social (wordmark + ícones de navegação + atalho pro próprio
// perfil pela foto, igual app de foto/vídeo social) em vez de abas
// genéricas — reforça que aqui é um espaço social, não mais uma tela de
// "conteúdo" comum do cockpit.
const CommunityView: React.FC<CommunityViewProps> = ({ userId, userName, userAvatarImage, token }) => {
  const [tab, setTab] = useState<CommunityTab>('feed');
  const [viewingProfileId, setViewingProfileId] = useState<string | null>(null);

  const openProfile = (id: string) => {
    setViewingProfileId(id);
    setTab('perfil');
  };

  const goTab = (t: CommunityTab) => {
    setTab(t);
    if (t === 'perfil') setViewingProfileId(null);
  };

  const resolvedMyAvatar = resolveMediaUrl(userAvatarImage);
  const myAvatar = resolvedMyAvatar ? { id: userId, avatarImage: resolvedMyAvatar, avatarType: 'photo' as const } : undefined;
  const viewingOwnProfile = tab === 'perfil' && !viewingProfileId;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflowY: 'auto',
        color: '#e8fdff',
        fontFamily: SANS,
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 28px',
          background: 'linear-gradient(180deg, rgba(4,10,14,0.96), rgba(4,10,14,0.88))',
          borderBottom: '1px solid rgba(0,234,255,0.18)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: 0.3, background: 'linear-gradient(135deg, #ffd76a, #ff6fae)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Comunidade
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <NavIcon active={tab === 'feed'} onClick={() => goTab('feed')} label="Feed">🏠</NavIcon>
          <NavIcon active={tab === 'membros'} onClick={() => goTab('membros')} label="Pessoas">🔍</NavIcon>
        </div>

        <button
          onClick={() => goTab('perfil')}
          title="Meu perfil"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, borderRadius: '50%', boxShadow: viewingOwnProfile ? '0 0 0 2px #ffd76a' : 'none' }}
        >
          <PlayerAvatarRenderer avatar={myAvatar} fallbackInitials={initialsOf(userName)} size={34} />
        </button>
      </div>

      <div style={{ padding: '22px 32px 60px' }}>
        {tab === 'feed' && (
          <CommunityFeed token={token} userAvatarImage={userAvatarImage} userName={userName} onOpenProfile={openProfile} />
        )}
        {tab === 'membros' && <CommunityMembers token={token} onOpenProfile={openProfile} />}
        {tab === 'perfil' && (
          <CommunityProfile
            token={token}
            userId={viewingProfileId ?? userId}
            onOpenProfile={openProfile}
            onBack={() => {
              setViewingProfileId(null);
              setTab('feed');
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CommunityView;
